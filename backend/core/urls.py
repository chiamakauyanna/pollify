from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    PollViewSet, ChoiceViewSet, VoteCreateView, PollStatsView,
    VoterRegisterView, AdminRegisterView, AdminInviteUserView, 
    OrgTokenObtainPairView, CustomTokenRefreshView,
)

router = DefaultRouter()
router.register("polls", PollViewSet, basename="poll")
router.register("choices", ChoiceViewSet, basename="choice")

urlpatterns = [
    # Registration
    path("auth/register/voter/", VoterRegisterView.as_view(), name="register_voter"),
    path("auth/register/admin/", AdminRegisterView.as_view(), name="register_admin"),
    path("auth/invite/", AdminInviteUserView.as_view(), name="admin_invite_user"),

    # Token login/refresh
    path("token/", OrgTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),

    # API
    path("", include(router.urls)),
    path("vote/", VoteCreateView.as_view(), name="vote"),
    path("polls/<uuid:pk>/stats/", PollStatsView.as_view(), name="poll-stats"),


]
