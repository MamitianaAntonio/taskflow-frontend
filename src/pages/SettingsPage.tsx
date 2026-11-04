import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import useUserStore from "../stores/userStore";
import PageHeader from "../components/ui/PageHeader";
import ProfileHero from "../components/Settings/ProfileHero";
import SettingsTabs from "../components/Settings/SettingsTabs";
import ProfileForm from "../components/Settings/ProfileForm";
import PasswordForm from "../components/Settings/PasswordForm";
import DangerZone from "../components/Settings/DangerZone";
import AppearanceSection from "../components/Settings/AppearanceSection";
import {
  DEFAULT_TAB,
  SETTINGS_TABS,
  isSettingsTab,
  type SettingsTab,
} from "../components/Settings/type/tabs";

const PANELS: Record<SettingsTab, React.ReactNode> = {
  account: <ProfileForm />,
  security: (
    <div className="flex flex-col gap-8">
      <PasswordForm />
      <DangerZone />
    </div>
  ),
  appearance: <AppearanceSection />,
};

export default function SettingsPage() {
  const user = useUserStore((state) => state.user);
  const reduceMotion = useReducedMotion();
  const [params, setParams] = useSearchParams();

  const raw = params.get("tab");
  const tab: SettingsTab = isSettingsTab(raw) ? raw : DEFAULT_TAB;
  const activeTab = SETTINGS_TABS.find((item) => item.id === tab) ?? SETTINGS_TABS[0];

  return (
    <div className="flex w-full flex-col gap-4 p-3 sm:gap-5 sm:p-4">
      <PageHeader
        title="Your"
        highlight="settings"
        description="Make TaskFlow feel like yours."
        meta={[{ label: activeTab.label, tone: "accent" }]}
      />

      <ProfileHero user={user} />

      <SettingsTabs
        tabs={SETTINGS_TABS}
        active={tab}
        onChange={(id) => setParams({ tab: id }, { replace: true })}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          tabIndex={0}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="outline-none"
        >
          {PANELS[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
