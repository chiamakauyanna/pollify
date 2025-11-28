import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/redux/slices/authSlice";
import { getAccessToken } from "@/utils/tokenManager";

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      dispatch(setAuthenticated(true));
    }
  }, [dispatch]);

  return null; 
};

export default AuthInitializer;
