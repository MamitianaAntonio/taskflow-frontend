import Button from "../components/ui/Button";

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <Button text="Login" variant="primary" />
    </form>
  )
}

export default LoginForm;