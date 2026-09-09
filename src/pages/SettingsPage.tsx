import { useState } from "react";
import useUserStore from "../stores/userStore";
import ProfileHero from "../components/Settings/ProfileHero";
import SettingsTabs from "../components/Settings/SettingsTabs";
import ProfileForm from "../components/Settings/ProfileForm";
import PasswordForm from "../components/Settings/PasswordForm";
import DangerZone from "../components/Settings/DangerZone";
import AppearanceSection from "../components/Settings/AppearanceSection";

const TABS = ["Account", "Security", "Appearance"] as const;
type SettingsTab = (typeof TABS)[number];

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const [tab, setTab] = useState<SettingsTab>("Account");

  return (
    <div className="mx-auto flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
      <div className="tracking-tight">
        <h1 className="text-xl font-bold uppercase tracking-wide text-(--text-primary) sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1.5 font-interface text-(--text-muted)">
          Tune your account your way
        </p>
      </div>

      <ProfileHero user={user} />
      <SettingsTabs tabs={[...TABS]} active={tab} onChange={(t) => setTab(t as SettingsTab)} />

      {tab === "Account" && <ProfileForm />}

      {tab === "Security" && (
        <div className="flex flex-col gap-8">
          <PasswordForm />
          <DangerZone />
        </div>
      )}

      {tab === "Appearance" && <AppearanceSection />}
    </div>
  );
}