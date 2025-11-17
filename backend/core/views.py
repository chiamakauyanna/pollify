from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.db import transaction
from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Poll, Choice, Vote
from .serializers import RegisterSerializer, PollSerializer, ChoiceSerializer, VoteSerializer, OrgTokenObtainPairSerializer, OrgUserInviteSerializer
from .permissions import IsVoterRole, IsAdminOrReadOnly, IsAdminRole


# Auth
class OrgTokenObtainPairView(TokenObtainPairView):
    serializer_class = OrgTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    pass

# Registration
class VoterRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['role'] = 'voter'
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AdminRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['role'] = 'admin'
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# Polls
@extend_schema_view(
    list=extend_schema(tags=['Polls'], description="List polls available to the user"),
    retrieve=extend_schema(tags=['Polls'], description="Retrieve details of a poll"),
    create=extend_schema(tags=['Polls'], description="Create a new poll (Admin only)"),
    update=extend_schema(tags=['Polls'], description="Update a poll (Admin only)"),
    partial_update=extend_schema(tags=['Polls'], description="Partial update (Admin only)"),
    destroy=extend_schema(tags=['Polls'], description="Delete a poll (Admin only)")
)
class PollViewSet(viewsets.ModelViewSet):
    serializer_class = PollSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Poll.objects.none()
        return Poll.objects.filter(organization=user.organization).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, organization=self.request.user.organization)

# Choices
class ChoiceViewSet(viewsets.ModelViewSet):
    serializer_class = ChoiceSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return Choice.objects.annotate(votes_count=Count("votes"))

# Voting
class VoteCreateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [IsVoterRole, IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        poll = serializer.validated_data["poll"]
        voter = request.user
        choice = serializer.validated_data["choice"]

        # Multi-org isolation
        if poll.organization != voter.organization:
            return Response({"detail": "You cannot vote on this poll."}, status=403)

        if not poll.is_votable:
            return Response({"detail": "Poll is not currently votable."}, status=400)

        vote, created = Vote.objects.get_or_create(poll=poll, voter=voter, defaults={'choice': choice})
        if not created:
            return Response({"detail": "You have already voted in this poll."}, status=400)

        return Response(VoteSerializer(vote).data, status=201)

# Poll Stats
class PollStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            poll = Poll.objects.get(pk=pk)
        except Poll.DoesNotExist:
            return Response({"detail": "Poll not found."}, status=404)

        if poll.organization != request.user.organization:
            return Response({"detail": "You cannot access this poll."}, status=403)

        total_votes = Vote.objects.filter(poll=poll).count()
        choices = Choice.objects.filter(poll=poll).annotate(votes_count=Count("votes")).values(
            "id", "text", "votes_count"
        )

        return Response({
            "poll": PollSerializer(poll).data,
            "total_votes": total_votes,
            "choices": list(choices)
        })

class AdminInviteUserView(generics.CreateAPIView):
    serializer_class = OrgUserInviteSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def create(self, request, *args, **kwargs):
        """
        Admin can invite/register a new voter in their organization.
        """
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "voter_id": user.voter_id,
            "organization": {
                "id": str(user.organization.id),
                "name": user.organization.name
            }
        }, status=status.HTTP_201_CREATED)
