import uuid
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone

ROLE_CHOICES = (("admin", "Admin"), ("voter", "Voter"))

def generate_voter_id():
    ts = timezone.now().strftime("%Y%m%d%H%M%S")
    suffix = uuid.uuid4().hex[:4].upper()
    return f"VOTER-{ts}-{suffix}"

class User(AbstractUser):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="voter")
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    voter_id = models.CharField(max_length=32, blank=True, null=True, unique=True)

    # New: assign a voter to an admin
    assigned_admin = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role": "admin"},
        related_name="voters"
    )

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def save(self, *args, **kwargs):
        if self.role == "voter" and not self.voter_id:
            vid = generate_voter_id()
            while User.objects.filter(voter_id=vid).exists():
                vid = generate_voter_id()
            self.voter_id = vid
        else:
            self.voter_id = None  # Admin has no voter_id
        super().save(*args, **kwargs)


class Poll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="polls")
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


class Choice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.poll.title} - {self.text}"


class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE, related_name="votes")
    voter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["poll", "voter"], name="unique_vote_per_poll")
        ]
