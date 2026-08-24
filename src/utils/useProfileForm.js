import { useState } from "react";
import useUserStore from "../stores/userStore";
import toast from "react-hot-toast";
import { updateUserEmail, updateUserName } from "../services/user";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function useProfileForm() {
  const user = useUserStore((state) => state.any);
  const setUser = useUserStore((state) => state.setUser);

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) =>
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const name = profile.name.trim();

    if (!name) return toast.error("Name cannot be empty");
    if (!EMAIL_RE.test(profile.email))
      return toast.error("Please enter a valid email");

    setSaving(true);
    try {
      if (name !== user?.name) await updateUserName(name);
      if (profile.email !== user?.email) await updateUserEmail(profile.email);
      setUser({ ...user, ...profile, name });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return { profile, setField, saving, submit };
}
