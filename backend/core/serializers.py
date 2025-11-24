from rest_framework import serializers
from .models import Poll, Choice, VoteLink, Vote, User


class ChoiceSerializer(serializers.ModelSerializer):
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Choice
        fields = ["id", "text", "votes_count"]

    def get_votes_count(self, obj):
        return obj.votes.count()


class VoteLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteLink
        fields = ["token", "poll", "invitee_email", "invitee_name", "used"]


class PollSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    vote_links = VoteLinkSerializer(many=True, read_only=True)
    is_votable = serializers.ReadOnlyField()
    show_results = serializers.ReadOnlyField()

    class Meta:
        model = Poll
        fields = ["id", "title", "description", "start_at", "end_at", "is_active", "choices", "is_votable", "vote_links", "show_results"]


class VoteSerializer(serializers.ModelSerializer):
    votelink = serializers.UUIDField(write_only=True)
    choice = serializers.UUIDField()

    class Meta:
        model = Vote
        fields = ["poll", "choice", "votelink"]

    def validate(self, attrs):
        token = attrs.get("votelink")
        try:
            votelink = VoteLink.objects.get(token=token)
        except VoteLink.DoesNotExist:
            raise serializers.ValidationError("Invalid vote token.")
        if votelink.used:
            raise serializers.ValidationError("This vote link has already been used.")
        attrs["votelink_obj"] = votelink
        return attrs

    def create(self, validated_data):
        votelink = validated_data.pop("votelink_obj")
        vote = Vote.objects.create(
            poll=validated_data["poll"],
            choice=validated_data["choice"],
            votelink=votelink,
        )
        votelink.mark_used()
        return vote

class PollResultsSerializer(serializers.Serializer):
    poll_id = serializers.UUIDField()
    title = serializers.CharField()
    description = serializers.CharField()
    results = serializers.ListField()
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
