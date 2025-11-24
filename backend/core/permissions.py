from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    """
    Only admin (staff) users can create polls or vote links.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff
