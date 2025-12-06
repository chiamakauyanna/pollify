from uuid import uuid4

from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Poll, Vote, VoteLink, User
from .serializers import (
    PollAdminSerializer,
    PollPublicSerializer,
    VoteLinkSerializer,
    VoteSerializer,
    PollResultsSerializer,
    MyTokenObtainPairSerializer,
)

from django.core.mail import send_mail, BadHeaderError


class PollViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for polls.
    """
    queryset = Poll.objects.all().order_by("-created_at")
    serializer_class = PollAdminSerializer
    permission_classes = [IsAdminUser]

    @action(
        detail=True,
        methods=["post"],
        url_path="generate-vote-link",
        permission_classes=[IsAdminUser]
    )
    def generate_vote_link(self, request, pk=None):
        poll = self.get_object()
        invitee_email = request.data.get("invitee_email")
        invitee_name = request.data.get("invitee_name")
        token = uuid4()
        vote_link = VoteLink.objects.create(
            poll=poll,
            token=token,
            invitee_email=invitee_email,
            invitee_name=invitee_name
        )
        serializer = VoteLinkSerializer(vote_link)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=True,
        methods=["post"],
        url_path="bulk-generate-links",
        permission_classes=[IsAdminUser]
    )
    def bulk_generate_links(self, request, pk=None):
        poll = self.get_object()
        invitees = request.data.get("invitees", [])

        if not isinstance(invitees, list):
            return Response({"error": "invitees must be a list."}, status=400)

        created_links = []
        base_url = request.build_absolute_uri("/").rstrip("/")

        for person in invitees:
            email = person.get("email")
            name = person.get("name")

            link = VoteLink.objects.create(
                poll=poll,
                invitee_email=email,
                invitee_name=name,
                token=uuid4(),
            )

            created_links.append({
                "token": str(link.token),
                "email": email,
                "name": name,
                "url": f"{base_url}/vote/{link.token}"
            })

        return Response({"links": created_links}, status=201)


class PublicPollDetailView(generics.RetrieveAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollPublicSerializer
    permission_classes = [AllowAny]


class VoteCreateView(generics.CreateAPIView):
    """
    Submit a vote via a VoteLink.
    Frontend should post { token: "<votelink>", choice_id: "<choice_uuid>" }.
    """
    permission_classes = [AllowAny]
    serializer_class = VoteSerializer

    def post(self, request, *args, **kwargs):
        data = {
            "votelink": request.data.get("token"),
            "choice": request.data.get("choice_id"),
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Vote submitted successfully."}, status=status.HTTP_201_CREATED)


class PollListView(generics.ListAPIView):
    """
    Public: active polls for voting.
    Only returns polls that are active and currently open.
    """
    queryset = Poll.objects.all()
    serializer_class = PollPublicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        qs = Poll.objects.filter(is_active=True, start_at__lte=now)
        qs = qs.filter(Q(end_at__gte=now) | Q(end_at__isnull=True))
        return qs.order_by("-created_at")


class PollResultsView(generics.RetrieveAPIView):
    """
    View poll results using a VoteLink, only after poll ends.
    Frontend hits: /poll-results/?token=<votelink>
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        token = request.query_params.get("token")
        if not token:
            return Response({"error": "token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            votelink = VoteLink.objects.get(token=token)
        except VoteLink.DoesNotExist:
            return Response({"error": "Invalid vote link."}, status=status.HTTP_404_NOT_FOUND)

        poll = votelink.poll
        if not poll.show_results:
            return Response({"error": "Results are not available yet."}, status=status.HTTP_403_FORBIDDEN)

        results = [
            {"choice_id": str(c.id), "text": c.text, "votes": c.votes.count()}
            for c in poll.choices.all()
        ]

        payload = {
            "poll_id": str(poll.id),
            "title": poll.title,
            "description": poll.description,
            "results": results,
        }
        serializer = PollResultsSerializer(payload)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()

        total_polls = Poll.objects.count()
        active_polls = Poll.objects.filter(is_active=True).count()
        closed_polls = Poll.objects.filter(end_at__lt=now).count()
        votable_polls = Poll.objects.filter(is_active=True, start_at__lte=now).filter(
            Q(end_at__gte=now) | Q(end_at__isnull=True)
        ).count()
        upcoming_polls = Poll.objects.filter(
            is_active=True, start_at__gt=now).count()

        total_votes = Vote.objects.count()
        todays_votes = Vote.objects.filter(created_at__date=now.date()).count()
        unique_voters = Vote.objects.values('votelink').distinct().count()

        most_voted_poll = Poll.objects.annotate(
            vote_count=Count("votes")).order_by("-vote_count").first()
        least_voted_poll = Poll.objects.annotate(
            vote_count=Count("votes")).order_by("vote_count").first()

        total_votelinks = VoteLink.objects.count()
        used_votelinks = VoteLink.objects.filter(used=True).count()
        votelink_usage_percent = round(
            (used_votelinks / total_votelinks) * 100, 2) if total_votelinks else 0

        total_users = User.objects.count()
        last_week = now - timezone.timedelta(days=7)
        recent_polls_count = Poll.objects.filter(
            created_at__gte=last_week).count()

        data = {
            "total_polls": total_polls,
            "active_polls": active_polls,
            "closed_polls": closed_polls,
            "votable_polls": votable_polls,
            "upcoming_polls": upcoming_polls,
            "total_votes": total_votes,
            "todays_votes": todays_votes,
            "unique_voters": unique_voters,
            "most_voted_poll": most_voted_poll.title if most_voted_poll else None,
            "least_voted_poll": least_voted_poll.title if least_voted_poll else None,
            "total_votelinks": total_votelinks,
            "used_votelinks": used_votelinks,
            "votelink_usage_percent": votelink_usage_percent,
            "total_users": total_users,
            "recent_polls_count": recent_polls_count,
        }

        return Response(data)


class PollStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        poll = get_object_or_404(Poll, pk=pk)
        stats = [
            {"choice_id": str(c.id), "text": c.text, "votes": c.votes.count()}
            for c in poll.choices.all()
        ]
        return Response({"poll": poll.title, "stats": stats})


class PublicClosedPollsView(generics.ListAPIView):
    serializer_class = PollPublicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Poll.objects.filter(end_at__lt=timezone.now()).order_by("-end_at")


class PollByTokenView(APIView):
    """
    Get poll details by vote link token.
    Frontend calls this to render the poll page.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")
        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            votelink = VoteLink.objects.get(token=token)
        except VoteLink.DoesNotExist:
            return Response({"error": "Invalid token."}, status=status.HTTP_404_NOT_FOUND)

        poll = votelink.poll
        data = PollPublicSerializer(poll).data
        data["has_voted"] = votelink.used

        return Response(data)

class SendBulkVoteLinksAPIView(APIView):
    permission_classes = [IsAdminUser] 

    def post(self, request):
        invitees = request.data.get("invitees", [])
        poll_title = request.data.get("poll_title", "Poll")
        sent_emails = []

        if not isinstance(invitees, list):
            return Response({"error": "Invitees must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        for inv in invitees:
            name = inv.get("name", "Guest")
            email = inv.get("email")
            link = inv.get("link")

            if not email or not link:
                continue  # skip invalid entries

            try:
                send_mail(
                    subject=f"You're invited to vote: {poll_title}",
                    message=f"Hi {name},\nVote here: {link}",
                    from_email="no-reply@pollify.com",
                    recipient_list=[email],
                    fail_silently=False,  # raise errors if any
                )
                sent_emails.append(email)
            except BadHeaderError:
                return Response({"error": "Invalid header found."}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"status": "emails sent", "sent_emails": sent_emails})
