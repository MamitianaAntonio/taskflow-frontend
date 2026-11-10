import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import useTodoStore from "../stores/todoStore";
import { useProjectStore } from "../stores/projectStore";
import useNotificationStore, {
  useBellNotificationStore,
} from "../stores/notificationStore";
import useSessionBootStore from "../stores/sessionBootStore";
import { ROUTES } from "../constants/routes";

export function useLogout() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);

  return () => {
    logout();
    // Drop cached workspace data so the next session starts from a clean,
    // freshly bootstrapped state.
    useTodoStore.getState().reset();
    useProjectStore.getState().reset();
    useNotificationStore.getState().reset();
    useBellNotificationStore.getState().reset();
    useSessionBootStore.getState().reset();
    navigate(ROUTES.login);
  };
}
