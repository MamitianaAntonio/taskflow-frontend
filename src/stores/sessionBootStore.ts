import { create } from "zustand";

export type BootPhase =
  | "idle"
  | "signing-in"
  | "waking-server"
  | "preparing"
  | "error";

interface SessionBootState {
  phase: BootPhase;
  action: string;
  detail: string;
  error: string | null;
  retry: (() => void) | null;

  begin: (action: string, detail: string) => void;
  prepare: () => void;
  fail: (message: string, retry: (() => void) | null) => void;
  finish: () => void;
  reset: () => void;
}

const WAKE_DELAY = 3000;

let wakeTimer: number | undefined;

const clearWakeTimer = () => {
  if (wakeTimer !== undefined) {
    window.clearTimeout(wakeTimer);
    wakeTimer = undefined;
  }
};

const useSessionBootStore = create<SessionBootState>()((set, get) => ({
  phase: "idle",
  action: "Signing you in",
  detail: "Checking your credentials.",
  error: null,
  retry: null,

  begin: (action, detail) => {
    clearWakeTimer();
    set({ phase: "signing-in", action, detail, error: null, retry: null });

    // A cold backend can take a while to answer the very first request.
    // Escalate the message instead of leaving the screen silent.
    wakeTimer = window.setTimeout(() => {
      wakeTimer = undefined;
      if (get().phase === "signing-in") {
        set({ phase: "waking-server" });
      }
    }, WAKE_DELAY);
  },

  prepare: () => {
    clearWakeTimer();
    set({ phase: "preparing" });
  },

  fail: (message, retry) => {
    clearWakeTimer();
    set({ phase: "error", error: message, retry });
  },

  finish: () => {
    clearWakeTimer();
    set({ phase: "idle", error: null, retry: null });
  },

  reset: () => {
    clearWakeTimer();
    set({ phase: "idle", error: null, retry: null });
  },
}));

export default useSessionBootStore;
