import { useEffect, useState } from "react";
import useTodoStore from "../stores/todoStore";
import { useProjectStore } from "../stores/projectStore";
import useSessionBootStore from "../stores/sessionBootStore";
import { bootstrapWorkspace, hasBootstrapped } from "../utils/bootstrap";

const hasWorkspace = () =>
  useTodoStore.getState().hasLoaded &&
  useProjectStore.getState().hasLoaded;

/**
 * On a full page refresh the dashboard is rendered before any data exists.
 * Keep the boot screen up until the first workspace load settles so the user
 * never sees an empty shell filling itself in.
 *
 * After a sign-in the workspace is already loaded (or already attempted), so
 * this only fades the boot screen out over the ready dashboard.
 */
export function useDashboardBoot(): boolean {
  const [ready, setReady] = useState(() => hasBootstrapped() || hasWorkspace());

  useEffect(() => {
    if (hasBootstrapped()) {
      useSessionBootStore.getState().finish();
      return;
    }

    const boot = useSessionBootStore.getState();
    boot.begin("Preparing your workspace", "Loading your tasks and projects.");
    boot.prepare();

    bootstrapWorkspace().finally(() => {
      setReady(true);
      useSessionBootStore.getState().finish();
    });
  }, []);

  return ready;
}
