import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const SignForm = () => {
  return (
    <form className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-md text-center font-medium text-(--text-secondary)">
          Enter your username :
        </label>
        <Input type="text" placeholder="johndoe" />
      </div>

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

      <div className="flex flex-col gap-1.5">
        <label className="text-md text-center font-medium text-(--text-secondary)">
          Confirm your password :
        </label>
        <Input type="password" placeholder="••••••••" />
      </div>

      <div className="flex justify-center gap-4">
        <Button text="Sign Up" variant="primary" />
        <Button text="Go to login" variant="outline" />
      </div>
    </form>
  );
};

export default SignForm;
