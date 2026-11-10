const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PING_TIMEOUT = 8000;
const RETRY_DELAY = 4000;

async function ping(timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

let warmUpStarted = false;

/**
 * Fires a lightweight request as soon as the sign-in page opens, so a cold
 * backend starts booting while the user is still typing their credentials.
 * It never blocks the login flow and stays silent on failure.
 */
export function warmUpBackend(): void {
  if (warmUpStarted) return;
  warmUpStarted = true;

  void (async () => {
    const awake = await ping(PING_TIMEOUT);
    if (awake) return;

    // Render can answer 502/503 while the instance is still starting.
    window.setTimeout(() => {
      void ping(PING_TIMEOUT);
    }, RETRY_DELAY);
  })();
}
