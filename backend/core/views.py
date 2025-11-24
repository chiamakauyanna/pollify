from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.utils import timezone
import uuid

from .models import Poll, Choice, VoteLink, Vote
from .serializers import PollSerializer, ChoiceSerializer, VoteLinkSerializer, VoteSerializer, PollResultsSerializer
from .permissions import IsAdminUser


class PollViewSet(viewsets.ModelViewSet):
    """
    Admin CRUD for polls.
    """
    queryset = Poll.objects.all().order_by("-created_at")
    serializer_class = PollSerializer
    permission_classes = [IsAdminUser]

    def create(self, request, *args, **kwargs):
        data = request.data
        choices_data = data.pop("choices", [])
        vote_links_data = data.pop("vote_links", [])

        poll = Poll.objects.create(
            title=data.get("title"),
            description=data.get("description", ""),
            start_at=data.get("start_at"),
            end_at=data.get("end_at"),
            is_active=data.get("is_active", True),
            created_by=request.user
        )

        for choice in choices_data:
            Choice.objects.create(poll=poll, text=choice.get("text"))

        vote_links = []
        for v in vote_links_data:
            token = uuid.uuid4()
            vl = VoteLink.objects.create(
                poll=poll,
                token=token,
                invitee_email=v.get("invitee_email"),
                invitee_name=v.get("invitee_name")
            )
            vote_links.append(vl)

        serializer = PollSerializer(poll)
        vote_links_serializer = VoteLinkSerializer(vote_links, many=True)
        return Response(
            {"poll": serializer.data, "vote_links": vote_links_serializer.data},
            status=status.HTTP_201_CREATED
        )

    def generate_vote_link(self, request, pk=None):
        poll = self.get_object()
        invitee_email = request.data.get("invitee_email")
        invitee_name = request.data.get("invitee_name")
        token = uuid.uuid4()
        vote_link = VoteLink.objects.create(
            poll=poll,
            token=token,
            invitee_email=invitee_email,
            invitee_name=invitee_name
        )
        serializer = VoteLinkSerializer(vote_link)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VoteCreateView(generics.CreateAPIView):
    """
    Submit a vote via a VoteLink.
    """
    permission_classes = [AllowAny]
    serializer_class = VoteSerializer

    def post(self, request, *args, **kwargs):
        token = request.data.get("token")
        choice_id = request.data.get("choice_id")
        if not token or not choice_id:
            return Response({"error": "token and choice_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            votelink = VoteLink.objects.get(token=token)
        except VoteLink.DoesNotExist:
            return Response({"error": "Invalid vote link."}, status=status.HTTP_404_NOT_FOUND)

        if votelink.used:
            return Response({"error": "This vote link has already been used."}, status=status.HTTP_400_BAD_REQUEST)

        poll = votelink.poll
        if not poll.is_votable:
            return Response({"error": "Voting for this poll is closed."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            choice = Choice.objects.get(id=choice_id, poll=poll)
        except Choice.DoesNotExist:
            return Response({"error": "Invalid choice for this poll."}, status=status.HTTP_400_BAD_REQUEST)

        Vote.objects.create(poll=poll, choice=choice, votelink=votelink)
        votelink.mark_used()

        return Response({"message": "Vote submitted successfully."}, status=status.HTTP_201_CREATED)


class PollListView(generics.ListAPIView):
    """
    Public: active polls for voting.
    """
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        return Poll.objects.filter(is_active=True, start_at__lte=now).order_by("-created_at")


class PollResultsView(generics.RetrieveAPIView):
    """
    View poll results using a VoteLink, only after poll ends.
    """
    permission_classes = [AllowAny]
    serializer_class = PollResultsSerializer

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

        results = [{"choice_id": str(
            c.id), "text": c.text, "votes": c.votes.count()} for c in poll.choices.all()]

        return Response({"poll_id": str(poll.id), "title": poll.title, "description": poll.description, "results": results}, status=status.HTTP_200_OK)
