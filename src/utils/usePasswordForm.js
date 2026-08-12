import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserPassword } from "../services/user";

export default function usePasswordForm() {
  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) =>
    setPassword((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!password.current) return toast.error("Current password is required");
    if (password.next.length < MIN_LENGTH)
      return toast.error(
        `New password must be at least ${MIN_LENGTH} characters`,
      );
    if (password.next !== password.confirm)
      return toast.error("Passwords do not match");

    setSaving(true);
    try {
      await updateUserPassword(password.current, password.next);
      setPassword({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return { password, setField, saving, submit };
}
