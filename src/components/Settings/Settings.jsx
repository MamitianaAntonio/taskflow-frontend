import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Field from "../form/Field";
import ProfileHero from "./ProfileHero";
import SettingsTabs from "./SettingsTabs";
import SettingsSection from "./SettingsSection";
import { DarkModeToggle } from "../ui/DarkModeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import useUserStore from "../../stores/userStore";
import {
  updateUserName,
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
} from "../../services/user";

const TABS = ["Account", "Security", "Appearance"];

export default function Settings() {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useTheme();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  const [tab, setTab] = useState("Account");
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const setField = (key) => (e) =>
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));

  const setPass = (key) => (e) =>
    setPassword((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) return toast.error("Name cannot be empty");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      return toast.error("Please enter a valid email");

    setSavingProfile(true);
    try {
      if (profile.name.trim() !== user?.name)
        await updateUserName(profile.name.trim());
      if (profile.email !== user?.email) await updateUserEmail(profile.email);
      setUser({ ...user, ...profile, name: profile.name.trim() });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!password.current) return toast.error("Current password is required");
    if (password.next.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (password.next !== password.confirm)
      return toast.error("Passwords do not match");

    setSavingPassword(true);
    try {
      await updateUserPassword(password.current, password.next);
      setPassword({ current: "", next: "", confirm: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const logoutAccount = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account, projects and tasks permanently?"))
      return;
    setDeleting(true);
    try {
      await deleteUserAccount();
      localStorage.removeItem("token");
      logout();
      toast.success("Account deleted");
      navigate("/login");
    } catch (error) {
      setDeleting(false);
      toast.error(error.message);
    }
  };

  const profileFields = [
    { label: "Name", icon: faUser, key: "name", placeholder: "Your name" },
    {
      label: "Email",
      icon: faEnvelope,
      key: "email",
      placeholder: "you@example.com",
      type: "email",
    },
  ];

  const passwordFields = [
    {
      label: "Current",
      icon: faLock,
      key: "current",
      placeholder: "Your current password",
      autoComplete: "current-password",
    },
    {
      label: "New",
      icon: faLock,
      key: "next",
      placeholder: "At least 6 characters",
      autoComplete: "new-password",
    },
    {
      label: "Confirm",
      icon: faLock,
      key: "confirm",
      placeholder: "Repeat new password",
      autoComplete: "new-password",
    },
  ];

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      <div className="tracking-tight">
        <h1 className="text-xl sm:text-2xl font-semibold uppercase bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-md text-(--text-muted) mt-1.5 font-interface">
          Tune your account your way
        </p>
      </div>

      <ProfileHero user={user} />

      <SettingsTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Account" && (
        <form onSubmit={handleSaveProfile} className="flex flex-col">
          <SettingsSection
            title="Profile"
            description="Update your name and email. These show up across your account."
            footer={
              <Button
                type="submit"
                variant="primary"
                loading={savingProfile}
                text="Save"
              />
            }
          >
            {profileFields.map(({ label, icon, key, placeholder, type }) => (
              <Field key={key} label={label} icon={icon}>
                <Input
                  type={type ?? "text"}
                  value={profile[key]}
                  onChange={setField(key)}
                  placeholder={placeholder}
                />
              </Field>
            ))}
          </SettingsSection>
        </form>
      )}

      {tab === "Security" && (
        <form onSubmit={handleSavePassword} className="flex flex-col gap-8">
          <SettingsSection
            title="Password"
            description="Keep your account safe with a strong, unique password."
            footer={
              <Button
                type="submit"
                variant="primary"
                loading={savingPassword}
                text="Update"
              />
            }
          >
            {passwordFields.map(
              ({ label, icon, key, placeholder, autoComplete }) => (
                <Field key={key} label={label} icon={icon}>
                  <Input
                    type="password"
                    value={password[key]}
                    onChange={setPass(key)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                  />
                </Field>
              ),
            )}
          </SettingsSection>

          <SettingsSection
            title="Danger zone"
            description="Irreversible actions — proceed with care."
            footer={
              <>
                <Button variant="outline" onClick={logoutAccount}>
                  Log out
                </Button>
                <Button
                  variant="outline"
                  className="hover:border-(--color-error) hover:text-(--color-error)"
                  loading={deleting}
                  onClick={handleDeleteAccount}
                >
                  <span className="mr-1">
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  </span>
                  Delete account
                </Button>
              </>
            }
          />
        </form>
      )}

      {tab === "Appearance" && (
        <SettingsSection
          title="Theme"
          description="Pick the look that feels right for your eyes."
        >
          <div className="flex items-center justify-between border border-(--border-color) rounded-lg px-4 py-3">
            <span className="text-sm text-(--text-primary)">Dark mode</span>
            <DarkModeToggle isDarkMode={isDarkMode} onChange={setIsDarkMode} />
          </div>
        </SettingsSection>
      )}
    </div>
  );
}
