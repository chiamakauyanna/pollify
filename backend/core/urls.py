from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PollViewSet,
    VoteCreateView,
    PollListView,
    PollResultsView,
    MyTokenObtainPairView,
    PublicPollDetailView,
    AdminAnalyticsView,
    PollStatsView,
    PublicClosedPollsView,
    PollByTokenView,
    SendBulkVoteLinksAPIView,
)

router = DefaultRouter()
router.register(r"polls", PollViewSet, basename="polls")

urlpatterns = [
    # JWT login
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Public voting endpoints
    path("vote/", VoteCreateView.as_view(), name="vote-create"),
    path("public-polls/", PollListView.as_view(), name="public-polls"),
    path("public-polls/<uuid:pk>/", PublicPollDetailView.as_view(), name="public-poll-detail"),
    path("poll-results/", PollResultsView.as_view(), name="poll-results"),
    path("public-closed-polls/", PublicClosedPollsView.as_view(), name="public-closed-polls"),
    path("polls/by-token/", PollByTokenView.as_view(), name="poll-by-token"),
    path("polls/send-bulk-vote-links/", SendBulkVoteLinksAPIView.as_view(), name="send-bulk-vote-links"),

    # Admin analytics & stats
    path("admin/analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
    path("polls/<uuid:pk>/stats/", PollStatsView.as_view(), name="poll-stats"),

    # Poll admin routes (ModelViewSet)
    path("", include(router.urls)),
]
