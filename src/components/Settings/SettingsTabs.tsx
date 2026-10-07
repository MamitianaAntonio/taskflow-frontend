import ChipTabs from "../ui/ChipTabs";
import type { TabItem } from "./type/tabs";

interface Props<T extends string> {
  tabs: readonly TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
}

export default function SettingsTabs<T extends string>({
  tabs,
  active,
  onChange,
}: Props<T>) {
  return (
    <ChipTabs
      items={tabs}
      value={active}
      onChange={onChange}
      role="tablist"
      ariaLabel="Settings sections"
    />
  );
}
