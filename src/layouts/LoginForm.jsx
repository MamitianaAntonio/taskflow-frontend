import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { login } from "../services/auth";

const LoginForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login({ email: formData.email, password: formData.password });
      // Toasts are handled in auth.ts
    } catch (error) {
      throw new Error(error.message);
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
        />
      </div>

      <Button type="submit" text="Login" variant="primary" />

      <p
        onClick={onSwitch}
        className="text-sm text-center cursor-pointer
        text-(--text-secondary)
        hover:text-(--accent-color) transition-colors duration-200"
      >
        Don't have an account?{" "}
        <span className="text-(--accent-color) font-medium">Sign up</span>
      </p>
    </form>
  );
};

export default LoginForm;
