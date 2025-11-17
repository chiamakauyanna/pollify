from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "role", None) == "admin")

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated and user.role == "admin"):
            return False
        org = getattr(obj, "organization", None)
        if org is None:
            return True
        return org == user.organization

class IsVoterRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "role", None) == "voter")

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated and user.role == "voter"):
            return False
        org = getattr(obj, "organization", None)
        if org is None:
            return True
        return org == user.organization

class IsOrgMember(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "organization", None) is not None)

    def has_object_permission(self, request, view, obj):
        user = request.user
        org = getattr(obj, "organization", None)
        if org is None:
            return True
        return org == user.organization

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return getattr(user, "organization", None) is not None
        return getattr(user, "role", None) == "admin"

    def has_object_permission(self, request, view, obj):
        user = request.user
        org = getattr(obj, "organization", None)
        if request.method in SAFE_METHODS:
            if org is None:
                return True
            return org == user.organization
        if getattr(user, "role", None) != "admin":
            return False
        if org is None:
            return True
        return org == user.organization
