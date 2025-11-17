from rest_framework import serializers
from .models import User, Poll, Choice, Vote, Organization
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role", "organization")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "unique_id", "voter_id", "organization")

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

class OrgTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = getattr(user, "role", None)
        if getattr(user, "organization", None):
            token['org_id'] = str(user.organization.id)
            token['org_name'] = user.organization.name
        token['unique_id'] = str(user.unique_id) if getattr(user, "unique_id", None) else None
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            "id": str(self.user.id),
            "username": self.user.username,
            "email": self.user.email,
            "role": getattr(self.user, "role", None),
            "unique_id": str(self.user.unique_id),
            "voter_id": getattr(self.user, "voter_id", None),
        }
        if getattr(self.user, "organization", None):
            data['organization'] = {
                "id": str(self.user.organization.id),
                "name": self.user.organization.name,
            }
        else:
            data['organization'] = None
        return data


class OrgUserInviteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "role")

    def create(self, validated_data):
        request_user = self.context['request'].user
        if request_user.role != "admin":
            raise serializers.ValidationError("Only admins can invite users.")
        
        # Ensure the new user belongs to admin's organization
        validated_data['organization'] = request_user.organization
        validated_data['role'] = "voter"  # invited users are voters

        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
