from rest_framework import generics, viewsets, status, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from django.db import transaction
from django.db.models import Count
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter

from .models import User, Poll, Choice, Vote
from .serializers import RegisterSerializer, PollSerializer, ChoiceSerializer, VoteSerializer
from .permissions import IsAdminRole, IsVoterRole, IsAdminOrReadOnly

# ----------------- Registration -----------------
@extend_schema(tags=['Authentication'], description="Register a new voter")
class VoterRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['role'] = 'voter'
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

@extend_schema(tags=['Authentication'], description="Register a new admin")
class AdminRegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['role'] = 'admin'
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

# ----------------- Login -----------------
@extend_schema(tags=['Authentication'], description="Admin login to obtain JWT token")
class AdminLoginView(TokenObtainPairView):
    serializer_class = type(
        'AdminTokenObtainPairSerializer', 
        (TokenObtainPairSerializer,),
        {
            'validate': lambda self, attrs: super(TokenObtainPairSerializer, self).validate(attrs) 
            if self.user.role == "admin" else serializers.ValidationError("User is not an admin.")
        }
    )

@extend_schema(tags=['Authentication'], description="Voter login to obtain JWT token")
class VoterLoginView(TokenObtainPairView):
    serializer_class = type(
        'VoterTokenObtainPairSerializer', 
        (TokenObtainPairSerializer,),
        {
            'validate': lambda self, attrs: super(TokenObtainPairSerializer, self).validate(attrs) 
            if self.user.role == "voter" else serializers.ValidationError("User is not a voter.")
        }
    )

# ----------------- Polls -----------------
@extend_schema_view(
    list=extend_schema(tags=['Polls'], description="List polls available to the user"),
    retrieve=extend_schema(tags=['Polls'], description="Retrieve details of a poll"),
    create=extend_schema(tags=['Polls'], description="Create a new poll (Admin only)"),
    update=extend_schema(tags=['Polls'], description="Update a poll (Admin only)"),
    partial_update=extend_schema(tags=['Polls'], description="Partially update a poll (Admin only)"),
    destroy=extend_schema(tags=['Polls'], description="Delete a poll (Admin only)"),
)
class PollViewSet(viewsets.ModelViewSet):
    serializer_class = PollSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        qs = Poll.objects.all().order_by("-created_at")
        user = self.request.user
        if user.is_authenticated and user.role == "voter":
            qs = qs.filter(is_active=True, created_by=user.assigned_admin)
        return qs

@extend_schema_view(
    list=extend_schema(tags=['Choices'], description="List choices with vote counts"),
    create=extend_schema(tags=['Choices'], description="Create a choice for a poll (Admin only)"),
)
class ChoiceViewSet(viewsets.ModelViewSet):
    serializer_class = ChoiceSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return Choice.objects.annotate(votes_count=Count("votes"))

# ----------------- Voting -----------------
@extend_schema(tags=['Voting'], description="Cast a vote for a poll")
class VoteCreateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [IsVoterRole, IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        poll = serializer.validated_data["poll"]
        choice = serializer.validated_data["choice"]
        voter = request.user

        if not poll.is_votable:
            return Response({"detail": "Poll is not currently votable."}, status=status.HTTP_400_BAD_REQUEST)

        vote, created = Vote.objects.get_or_create(
            poll=poll,
            voter=voter,
            defaults={'choice': choice}
        )
        if not created:
            return Response({"detail": "You have already voted in this poll."}, status=status.HTTP_400_BAD_REQUEST)

        out = VoteSerializer(vote)
        return Response(out.data, status=status.HTTP_201_CREATED)

# ----------------- Poll Stats -----------------
@extend_schema(tags=['Poll Stats'], description="Retrieve live statistics for a poll")
class PollStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            poll = Poll.objects.get(pk=pk)
        except Poll.DoesNotExist:
            return Response({"detail": "Poll not found."}, status=404)

        if request.user.role == "voter" and poll.created_by != request.user.assigned_admin:
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
