import { useState } from "react";
import { notify } from "../../utils/toast";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../services/auth";
import useUserStore from "../../stores/userStore";
import { getErrorMessage } from "../../api/axios";
import { ROUTES } from "../../constants/routes";

type GoogleButtonText =
  | "signin_with"
  | "signup_with"
  | "continue_with"
  | "signin";

interface GoogleAuthButtonProps {
  disabled?: boolean;
  text?: GoogleButtonText;
}

const GoogleAuthButton = ({
  disabled = false,
  text = "continue_with",
}: GoogleAuthButtonProps) => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      notify.error("Google authentication failed. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);
      login(result.token, result.user);
      navigate(ROUTES.dashboard);
    } catch (error) {
      notify.error(getErrorMessage(error, "Google sign-in failed"));
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-(--text-secondary)">
        <span className="h-px flex-1 bg-(--border-color)" />
        or
        <span className="h-px flex-1 bg-(--border-color)" />
      </div>

      <div
        className={`flex justify-center ${
          isDisabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            notify.error("Google authentication failed. Please try again.")
          }
          useOneTap={false}
          theme="outline"
          size="large"
          text={text}
          width="100%"
        />
      </div>
    </>
  );
};

export default GoogleAuthButton;
