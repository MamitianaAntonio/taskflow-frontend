export const homeTabs = [
  { key: "start", label: "Start" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
] as const;

export type HomeTabKey = (typeof homeTabs)[number]["key"];

export function isHomeTab(value: string | null): value is HomeTabKey {
  return homeTabs.some((tab) => tab.key === value);
}
