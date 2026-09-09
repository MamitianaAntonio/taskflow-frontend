import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { signUp } from "../services/auth";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios";
import { ROUTES } from "../constants/routes";

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
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [loading, setLoading] = useState(false);
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
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp({
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
      login(result.token, result.user);
      navigate(ROUTES.dashboard);
    } catch (error) {
      toast.error(getErrorMessage(error, "Sign up failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-md font-medium text-(--text-secondary)"
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
          disabled={loading}
        />
      </div>

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
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="confirmPassword"
          className="text-md font-medium text-(--text-secondary)"
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
          disabled={loading}
        />
      </div>

      <Button type="submit" text="Sign Up" variant="primary" loading={loading} disabled={loading} />

      <p
        onClick={loading ? undefined : onSwitch}
        className="cursor-pointer text-center text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--accent-color)"
      >
        Already have an account?{" "}
        <span className="font-medium text-(--accent-color)">Login</span>
      </p>
    </form>
  );
};

export default SignForm;