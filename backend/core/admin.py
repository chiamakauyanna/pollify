from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Poll, Choice, Vote

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ("title", "created_by", "is_active", "start_at", "end_at", "created_at")
    list_filter = ("is_active", "created_at", "created_by")
    search_fields = ("title", "description", "created_by__username")
    readonly_fields = ("id",)

@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ("text", "poll")
    search_fields = ("text", "poll__title")

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("voter", "poll", "choice", "created_at")
    readonly_fields = ("id", "voter", "created_at")
