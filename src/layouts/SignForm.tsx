import { useState, type ChangeEvent, type FormEvent } from "react";
import { notify } from "../utils/toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import { useSignIn } from "../hooks/useSignIn";

interface SignFormProps {
  onSwitch: () => void;
}

interface SignFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignForm = ({ onSwitch }: SignFormProps) => {
  const { signUpWithCredentials, isBusy } = useSignIn();
  const [formData, setFormData] = useState<SignFields>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      notify.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notify.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      notify.error("Password must be at least 6 characters");
      return;
    }

    await signUpWithCredentials(
      formData.username,
      formData.email,
      formData.password,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase"
        >
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          disabled={isBusy}
          className="py-2.5 text-base sm:py-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isBusy}
          className="py-2.5 text-base sm:py-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          disabled={isBusy}
          className="py-2.5 text-base sm:py-3"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="font-interface text-[11px] font-medium tracking-[0.14em] text-(--text-muted) uppercase"
        >
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isBusy}
          className="py-2.5 text-base sm:py-3"
        />
      </div>

      <Button
        type="submit"
        text="Sign Up"
        variant="primary"
        loading={isBusy}
        loadingText="Creating your account…"
        disabled={isBusy}
      />

      <GoogleAuthButton disabled={isBusy} text="signup_with" />

      <button
        type="button"
        onClick={onSwitch}
        disabled={isBusy}
        className="mt-1 rounded font-interface text-center text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--accent-color) focus-visible:ring-2 focus-visible:ring-(--accent-color) focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        Already have an account?{" "}
        <span className="font-medium text-(--accent-strong)">Login</span>
      </button>
    </form>
  );
};

export default SignForm;
