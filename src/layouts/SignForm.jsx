import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { signUp } from "../services/auth";
import { useNavigate } from "react-router-dom";

const SignForm = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
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

    try {
      await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      // redirect after successful signup
      navigate("/dashboard");
    } catch (error) {
      throw new Error(error.message);
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
        />
      </div>

      <Button type="submit" text="Sign Up" variant="primary" />

      <p
        onClick={onSwitch}
        className="text-sm text-center cursor-pointer
        text-(--text-secondary)
        hover:text-(--accent-color) transition-colors duration-200"
      >
        Already have an account?{" "}
        <span className="text-(--accent-color) font-medium">Login</span>
      </p>
    </form>
  );
};

export default SignForm;
