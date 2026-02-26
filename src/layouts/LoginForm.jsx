import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const LoginForm = () => {
  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-md text-center font-medium text-(--text-secondary)">
          Enter your email :
        </label>
        <Input type="email" placeholder="you@example.com" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-md text-center font-medium text-(--text-secondary)">
          Enter your password :
        </label>
        <Input type="password" placeholder="••••••••" />
      </div>

      <div className="flex justify-center">
        <Button text="Login" variant="primary" />
      </div>

      <a
        href=""
        className="text-sm text-(--text-secondary) text-center 
        hover:text-(--accent-color) transition-colors duration-200"
      >
        Don't have an account?{" "}
        <span className="text-(--accent-color) font-medium">Sign up</span>
      </a>
    </form>
  );
};

export default LoginForm;
