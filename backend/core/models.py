import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """
    Admins only. Handles poll creation & vote link generation.
    """
    def __str__(self):
        return self.username


class Poll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_polls")
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def is_votable(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.start_at and now < self.start_at:
            return False
        if self.end_at and now > self.end_at:
            return False
        return True

    @property
    def show_results(self):
        return self.end_at and timezone.now() > self.end_at


class Choice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.text} ({self.poll.title})"


class VoteLink(models.Model):
    """
    Magic link system: each token allows one vote.
    Voters do not need an account.
    """
    token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="vote_links")
    invitee_email = models.EmailField(max_length=254, blank=True, null=True)
    invitee_name = models.CharField(max_length=255, blank=True, null=True)
    used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def mark_used(self):
        self.used = True
        self.used_at = timezone.now()
        self.save(update_fields=["used", "used_at"])

    def __str__(self):
        return f"VoteLink({self.token}) -> {self.poll.title}"


class Vote(models.Model):
    """
    Stores a vote cast using a VoteLink.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name="votes")
    votelink = models.OneToOneField(VoteLink, on_delete=models.CASCADE, related_name="vote")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (("poll", "votelink"),)

    def __str__(self):
        return f"Vote ({self.poll.title}) -> {self.choice.text}"
