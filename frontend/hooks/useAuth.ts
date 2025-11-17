import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  adminLoginThunk,
  adminRegisterThunk,
  voterLoginThunk,
  voterRegisterThunk,
  logout,
} from "@/redux/slices/authSlice";
import {
  selectCurrentUser,
  selectOrganization,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "@/redux/selectors";

// Hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectCurrentUser);
  const organization = useSelector(selectOrganization);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Action dispatchers
  const loginAdmin = (data: { username: string; password: string }) =>
    dispatch(adminLoginThunk(data));

  const registerAdmin = (data: {
    username: string;
    email: string;
    password: string;
  }) => dispatch(adminRegisterThunk(data));

  const loginVoter = (data: { username: string; password: string }) =>
    dispatch(voterLoginThunk(data));

  const registerVoter = (data: {
    username: string;
    email: string;
    password: string;
  }) => dispatch(voterRegisterThunk(data));

  const logoutUser = () => dispatch(logout());

  return {
    user,
    organization,
    loading,
    error,
    isAuthenticated,
    loginAdmin,
    registerAdmin,
    loginVoter,
    registerVoter,
    logoutUser,
  };
};
