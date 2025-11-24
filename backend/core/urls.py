from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import PollViewSet, VoteCreateView, PollListView, PollResultsView

router = DefaultRouter()
router.register(r"polls", PollViewSet, basename="polls")

urlpatterns = [
    # JWT login
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Public voting endpoints
    path("vote/", VoteCreateView.as_view(), name="vote-create"),
    path("public-polls/", PollListView.as_view(), name="public-polls"),
    path("poll-results/", PollResultsView.as_view(), name="poll-results"),

    # Poll admin routes
    path("", include(router.urls)),
]
