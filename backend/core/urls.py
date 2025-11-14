from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    PollViewSet, ChoiceViewSet, VoteCreateView, PollStatsView,
    VoterRegisterView, AdminRegisterView,
    VoterLoginView, AdminLoginView
)

router = DefaultRouter()
router.register("polls", PollViewSet, basename="poll")
router.register("choices", ChoiceViewSet, basename="choice")

urlpatterns = [
     # Registration
    path("auth/register/voter/", VoterRegisterView.as_view(), name="register_voter"),
    path("auth/register/admin/", AdminRegisterView.as_view(), name="register_admin"),
    
    # Login
    path("auth/login/voter/", VoterLoginView.as_view(), name="login_voter"),
    path("auth/login/admin/", AdminLoginView.as_view(), name="login_admin"),

    # API
    path("", include(router.urls)),
    path("vote/", VoteCreateView.as_view(), name="vote"),
    path("polls/<uuid:pk>/stats/", PollStatsView.as_view(), name="poll-stats"),
]
