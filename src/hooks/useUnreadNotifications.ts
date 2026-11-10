import { useEffect } from "react";
import useNotificationStore from "../stores/notificationStore";
import { subscribeMutations } from "../utils/eventBus";

export function useUnreadNotifications(): void {
  const fetchUnreadCount = useNotificationStore(
    (state) => state.fetchUnreadCount,
  );

  useEffect(() => {
    const refresh = () => fetchUnreadCount().catch(() => {});

    // The workspace bootstrap already fetched the counter; skip the immediate
    // duplicate and let the interval keep it fresh from there.
    if (!useNotificationStore.getState().hasLoadedCount) {
      refresh();
    }

    const interval = setInterval(refresh, 15000);
    document.addEventListener("visibilitychange", refresh);
    const unsubscribe = subscribeMutations(refresh);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      unsubscribe();
    };
  }, [fetchUnreadCount]);
}