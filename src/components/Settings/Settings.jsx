import { useState } from "react";
import useUserStore from "../../stores/userStore";
import ProfileHero from "./ProfileHero";
import SettingsTabs from "./SettingsTabs";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import DangerZone from "./DangerZone";
import AppearanceSection from "./AppearanceSection";

const TABS = ["Account", "Security", "Appearance"];

export default function Settings() {
  const user = useUserStore((state) => state.user);
  const [tab, setTab] = useState("Account");

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 mx-auto">
      <div className="tracking-tight">
        <h1
          className="text-xl sm:text-2xl font-semibold uppercase bg-linear-to-r from-(--gradient-from)
          to-(--gradient-to) bg-clip-text text-transparent"
        >
          Settings
        </h1>
        <p className="text-md text-(--text-muted) mt-1.5 font-interface">
          Tune your account your way
        </p>
      </div>

      <ProfileHero user={user} />
      <SettingsTabs tabs={TABS} active={tab} onChange={setTab} />

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
