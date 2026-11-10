import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  googleLogin,
  login as loginRequest,
  signUp,
  type AuthResult,
} from "../services/auth";
import useUserStore from "../stores/userStore";
import useSessionBootStore from "../stores/sessionBootStore";
import { bootstrapWorkspace } from "../utils/bootstrap";
import { getErrorMessage } from "../api/axios";
import { notify } from "../utils/toast";
import { ROUTES } from "../constants/routes";

const isNetworkFailure = (error: unknown): error is AxiosError =>
  error instanceof AxiosError &&
  (!error.response ||
    error.code === "ECONNABORTED" ||
    error.code === "ERR_NETWORK");

interface AuthAttempt {
  action: string;
  detail: string;
  fallback: string;
  request: () => Promise<AuthResult>;
}

/**
 * Drives one sign-in attempt from the submit click to the first rendered
 * dashboard: authenticate, preload the workspace, then leave the boot screen.
 */
export function useSignIn() {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const isBusy = useSessionBootStore((state) => state.phase !== "idle");

  async function complete({
    action,
    detail,
    fallback,
    request,
  }: AuthAttempt): Promise<void> {
    const boot = useSessionBootStore.getState();
    // Ignore extra submits while an attempt is already running; retries are
    // allowed because they start from the error phase.
    if (boot.phase !== "idle" && boot.phase !== "error") return;

    boot.begin(action, detail);

    try {
      const result = await request();
      login(result.token, result.user);

      boot.prepare();
      await bootstrapWorkspace();

      navigate(ROUTES.dashboard);
    } catch (error) {
      if (isNetworkFailure(error)) {
        const message =
          error.code === "ECONNABORTED"
            ? "The server is taking too long to answer. It may still be waking up."
            : "We couldn't reach the server. Check your connection and try again.";

        // Retry the same attempt without asking the user to type again.
        boot.fail(message, () => {
          void complete({ action, detail, fallback, request });
        });
        return;
      }

      boot.reset();
      notify.error(getErrorMessage(error, fallback));
    }
  }

  const signInWithCredentials = (email: string, password: string) =>
    complete({
      action: "Signing you in",
      detail: "Checking your credentials.",
      fallback: "Login failed",
      request: () => loginRequest({ email, password }),
    });

  const signUpWithCredentials = (name: string, email: string, password: string) =>
    complete({
      action: "Creating your account",
      detail: "Setting up your TaskFlow space.",
      fallback: "Sign up failed",
      request: () => signUp({ name, email, password }),
    });

  const signInWithGoogle = (credential: string) =>
    complete({
      action: "Signing you in",
      detail: "Checking your Google account.",
      fallback: "Google sign-in failed",
      request: () => googleLogin(credential),
    });

  return {
    isBusy,
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
  };
}
