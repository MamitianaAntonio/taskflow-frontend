import {
  faPalette,
  faShieldHalved,
  faUser,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon: IconDefinition;
}

export const SETTINGS_TABS = [
  { id: "account", label: "Account", icon: faUser },
  { id: "security", label: "Security", icon: faShieldHalved },
  { id: "appearance", label: "Appearance", icon: faPalette },
] as const satisfies readonly TabItem[];

export type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

export const DEFAULT_TAB: SettingsTab = "account";

export const isSettingsTab = (value: string | null): value is SettingsTab =>
  SETTINGS_TABS.some((t) => t.id === value);
