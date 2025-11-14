from rest_framework import serializers
from .models import User, Poll, Choice, Vote
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ("username", "email", "password", "role", "assigned_admin")
        read_only_fields = ("role",)  # role is forced in view

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "unique_id", "voter_id", "assigned_admin")


class ChoiceSerializer(serializers.ModelSerializer):
    votes_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Choice
        fields = ("id", "text", "votes_count")


class PollSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Poll
        fields = ("id", "title", "description", "created_by", "start_at", "end_at", "is_active", "choices", "created_at")


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ("id", "poll", "choice", "voter", "created_at")
        read_only_fields = ("voter", "created_at")

    def validate(self, data):
        if data['choice'].poll_id != data['poll'].id:
            raise serializers.ValidationError("Choice does not belong to the selected poll.")
        return data
