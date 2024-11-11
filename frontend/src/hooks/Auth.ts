import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { loginSuccess, logout } from "../store/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();

  const handleAuth = () => {
    const token = Cookies.get("authentication");
    if (!token) {
      dispatch(logout());
    } else {
      const user = JSON.parse(token);
      dispatch(loginSuccess(user));
    }
  };

  return { handleAuth };
};
