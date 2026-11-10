import { useState, type ChangeEvent, type FormEvent } from "react";
import { notify } from "../utils/toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import { useSignIn } from "../hooks/useSignIn";

interface LoginFormProps {
  onSwitch: () => void;
}

interface LoginFields {
  email: string;
  password: string;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const { signInWithCredentials, isBusy } = useSignIn();
  const [formData, setFormData] = useState<LoginFields>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      notify.error("Please fill in all fields");
      return;
    }

    await signInWithCredentials(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-md font-medium text-(--text-secondary)"
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
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-md font-medium text-(--text-secondary)"
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
        />
      </div>

      <Button
        type="submit"
        text="Login"
        variant="primary"
        loading={isBusy}
        loadingText="Signing in…"
        disabled={isBusy}
      />

      <GoogleAuthButton disabled={isBusy} text="signin_with" />

      <p
        onClick={isBusy ? undefined : onSwitch}
        className="cursor-pointer text-center text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--accent-color)"
      >
        Don't have an account?{" "}
        <span className="font-medium text-(--accent-color)">Sign up</span>
      </p>
    </form>
  );
};

export default LoginForm;
