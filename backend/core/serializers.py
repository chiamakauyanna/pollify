from rest_framework import serializers
from .models import Poll, Choice, VoteLink, Vote, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ChoiceSerializer(serializers.ModelSerializer):
    votes_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Choice
        fields = ["id", "text", "votes_count"]

    def get_votes_count(self, obj):
        return obj.votes.count()


class VoteLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteLink
        fields = ["token", "poll", "invitee_email", "invitee_name", "used", "created_at"]
        read_only_fields = ["token", "used", "created_at"]


# Admin-facing poll serializer (includes vote links)
class PollAdminSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)
    vote_links = VoteLinkSerializer(many=True, read_only=True)
    is_votable = serializers.ReadOnlyField()
    show_results = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = [
            "id",
            "title",
            "description",
            "start_at",
            "end_at",
            "is_active",
            "choices",
            "vote_links",
            "is_votable",
            "show_results",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        choices_data = validated_data.pop("choices", [])
        poll = Poll.objects.create(**validated_data)

        for choice in choices_data:
            Choice.objects.create(poll=poll, text=choice["text"])

        return poll

    def update(self, instance, validated_data):
        choices_data = validated_data.pop("choices", None)

        # update poll fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # replace choices (not append)
        if choices_data is not None:
            instance.choices.all().delete()
            for choice in choices_data:
                Choice.objects.create(poll=instance, text=choice["text"])

        return instance


# Public-facing poll serializer (hide vote links)
class PollPublicSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    is_votable = serializers.ReadOnlyField()
    show_results = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = [
            "id",
            "title",
            "description",
            "start_at",
            "end_at",
            "is_active",
            "choices",
            "is_votable",
            "show_results",
            "created_at",
        ]


class VoteSerializer(serializers.ModelSerializer):
    # Frontend will send votelink token and choice id
    votelink = serializers.UUIDField(write_only=True)
    choice = serializers.UUIDField(write_only=True)

    class Meta:
        model = Vote
        # We do not accept poll from client — it's derived from votelink
        fields = ["votelink", "choice"]

    def validate(self, attrs):
        token = attrs.get("votelink")
        choice_id = attrs.get("choice")

        # Validate vote link
        try:
            votelink = VoteLink.objects.get(token=token)
        except VoteLink.DoesNotExist:
            raise serializers.ValidationError({"votelink": "Invalid vote token."})

        if votelink.used:
            raise serializers.ValidationError({"votelink": "This vote link has already been used."})

        poll = votelink.poll

        # Validate poll is votable
        if not poll.is_votable:
            raise serializers.ValidationError({"poll": "Voting for this poll is closed."})

        # Validate choice belongs to poll
        try:
            choice = Choice.objects.get(id=choice_id, poll=poll)
        except Choice.DoesNotExist:
            raise serializers.ValidationError({"choice": "Invalid choice for this poll."})

        # Prevent double voting by same votelink is already enforced (votelink.used)
        attrs["votelink_obj"] = votelink
        attrs["choice_obj"] = choice
        attrs["poll_obj"] = poll
        return attrs

    def create(self, validated_data):
        votelink = validated_data["votelink_obj"]
        choice = validated_data["choice_obj"]
        poll = validated_data["poll_obj"]

        vote = Vote.objects.create(poll=poll, choice=choice, votelink=votelink)
        votelink.mark_used()
        return vote


class PollResultsSerializer(serializers.Serializer):
    poll_id = serializers.UUIDField()
    title = serializers.CharField()
    description = serializers.CharField()
    results = serializers.ListField()  # list of {"choice_id", "text", "votes"}


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        return token
