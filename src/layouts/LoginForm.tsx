import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { login as loginRequest } from "../services/auth";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../api/axios";
import { ROUTES } from "../constants/routes";

interface LoginFormProps {
  onSwitch: () => void;
}

interface LoginFields {
  email: string;
  password: string;
}

const LoginForm = ({ onSwitch }: LoginFormProps) => {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);
  const [loading, setLoading] = useState(false);
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
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await loginRequest({ email: formData.email, password: formData.password });
      login(result.token, result.user);
      navigate(ROUTES.dashboard);
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
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

      <Button
        type="submit"
        text="Login"
        variant="primary"
        loading={loading}
        disabled={loading}
      />

      <p
        onClick={!loading ? onSwitch : undefined}
        className="cursor-pointer text-center text-sm text-(--text-secondary) transition-colors duration-200 hover:text-(--accent-color)"
      >
        Don't have an account?{" "}
        <span className="font-medium text-(--accent-color)">Sign up</span>
      </p>
    </form>
  );
};

export default LoginForm;