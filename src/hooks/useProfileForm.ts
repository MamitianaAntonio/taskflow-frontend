import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import useUserStore from "../stores/userStore";
import { updateUserEmail, updateUserName } from "../services/user";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProfileValue {
  name: string;
  email: string;
}

type ProfileKey = keyof ProfileValue;

export function useProfileForm() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [profile, setProfile] = useState<ProfileValue>({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [saving, setSaving] = useState(false);

  const setField =
    (key: ProfileKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setProfile((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const name = profile.name.trim();

    if (!name) return toast.error("Name cannot be empty");
    if (!EMAIL_RE.test(profile.email))
      return toast.error("Please enter a valid email");

    setSaving(true);
    try {
      if (user && name !== user.name) await updateUserName(name);
      if (user && profile.email !== user.email) await updateUserEmail(profile.email);
      if (user) setUser({ ...user, ...profile, name });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return { profile, setField, saving, submit };
}