import { RootState } from "../store";

// ------- AUTH SELECTORS -------

// Get current logged-in user
export const selectCurrentUser = (state: RootState) => state.auth.user;

// Get user's organization
export const selectOrganization = (state: RootState) => state.auth.organization;

// Get auth loading state
export const selectAuthLoading = (state: RootState) => state.auth.loading;

// Get auth error message
export const selectAuthError = (state: RootState) => state.auth.error;

// Check if user is authenticated
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

// Get the user role (admin/voter)
export const selectUserRole = (state: RootState) => state.auth.user?.role;
