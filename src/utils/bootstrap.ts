import useTodoStore from "../stores/todoStore";
import { useProjectStore } from "../stores/projectStore";
import useNotificationStore from "../stores/notificationStore";

const BOOT_TIMEOUT = 20000;

let inFlight: Promise<void> | null = null;
let attempted = false;

// Warm the lazy dashboard chunk while the boot screen is up, so the route
// change does not fall back to a spinner on a first visit.
const preloadDashboard = () => {
  void import("../pages/DashboardHome");
};

/** True once a workspace load has been started in this page session. */
export function hasBootstrapped(): boolean {
  return attempted;
}

/** Resolve when the work is done, or when the boot budget is spent. */
const withTimeout = (work: Promise<unknown>, ms: number): Promise<void> =>
  new Promise((resolve) => {
    const timer = window.setTimeout(resolve, ms);
    void work.finally(() => {
      window.clearTimeout(timer);
      resolve();
    });
  });

async function loadWorkspace(): Promise<void> {
  const todo = useTodoStore.getState();
  const project = useProjectStore.getState();
  const notification = useNotificationStore.getState();

  const requests: Promise<unknown>[] = [];

  if (!todo.hasLoaded && !todo.isLoading) {
    requests.push(todo.fetchTodos().catch(() => undefined));
  }
  if (!project.hasLoaded && !project.isLoading) {
    requests.push(project.fetchAll().catch(() => undefined));
  }
  // The bell counter is cheap and not worth its own skeleton.
  requests.push(notification.fetchUnreadCount().catch(() => undefined));

  await withTimeout(Promise.allSettled(requests), BOOT_TIMEOUT);
}

/**
 * Loads everything the dashboard needs in parallel. Repeated calls share the
 * same run so React strict mode or overlapping mounts cannot duplicate it.
 */
export function bootstrapWorkspace(): Promise<void> {
  if (!inFlight) {
    preloadDashboard();
    inFlight = loadWorkspace().finally(() => {
      attempted = true;
      inFlight = null;
    });
  }
  return inFlight;
}

/** Fetch the task list only when the store is still empty. */
export function loadTodosIfNeeded(): void {
  const state = useTodoStore.getState();
  if (state.hasLoaded || state.isLoading) return;
  void state.fetchTodos().catch(() => undefined);
}

/** Fetch the project list only when the store is still empty. */
export function loadProjectsIfNeeded(): void {
  const state = useProjectStore.getState();
  if (state.hasLoaded || state.isLoading) return;
  void state.fetchAll().catch(() => undefined);
}
