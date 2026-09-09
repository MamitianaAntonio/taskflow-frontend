import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import { ROUTES } from "../constants/routes";

export function useLogout() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  return () => {
    logout();
    navigate(ROUTES.login);
  };
}