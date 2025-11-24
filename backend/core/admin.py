from django.contrib import admin
from .models import User, Poll, Choice, VoteLink, Vote

# Inline for Choices with vote count
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 1
    readonly_fields = ["id", "votes_count"]
    
    # Show vote counts
    def votes_count(self, obj):
        return obj.votes.count()
    votes_count.short_description = "Votes"

# Inline for VoteLinks
class VoteLinkInline(admin.TabularInline):
    model = VoteLink
    extra = 1
    readonly_fields = ["token", "used", "used_at", "created_at"]

# Poll admin
@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ["title", "created_by", "start_at", "end_at", "is_active", "created_at"]
    search_fields = ["title", "description"]
    list_filter = ["is_active", "start_at", "end_at"]
    inlines = [ChoiceInline, VoteLinkInline]

# User admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "is_staff", "is_superuser", "last_login"]
    search_fields = ["username", "email"]
    list_filter = ["is_staff", "is_superuser"]

# Choice admin (optional)
@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ["text", "poll", "votes_count"]
    search_fields = ["text", "poll__title"]
    
    def votes_count(self, obj):
        return obj.votes.count()
    votes_count.short_description = "Votes"

# VoteLink admin (optional)
@admin.register(VoteLink)
class VoteLinkAdmin(admin.ModelAdmin):
    list_display = ["token", "poll", "invitee_email", "invitee_name", "used", "used_at", "created_at"]
    search_fields = ["poll__title", "invitee_email", "invitee_name"]
    list_filter = ["used", "created_at"]

# Vote admin
@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ["poll", "choice", "votelink", "created_at"]
    search_fields = ["poll__title", "choice__text", "votelink__token"]
    list_filter = ["created_at"]
