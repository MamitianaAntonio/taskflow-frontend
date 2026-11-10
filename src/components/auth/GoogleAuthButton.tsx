import { notify } from "../../utils/toast";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useSignIn } from "../../hooks/useSignIn";

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
  const { signInWithGoogle, isBusy } = useSignIn();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      notify.error("Google authentication failed. Please try again.");
      return;
    }

    void signInWithGoogle(credentialResponse.credential);
  };

  const isDisabled = disabled || isBusy;

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
