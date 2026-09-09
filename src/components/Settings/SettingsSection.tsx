import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
  footer,
}: SettingsSectionProps) {
  return (
    <section className="flex flex-col">
      <div className="mb-4">
        <p className="font-interface text-xs font-semibold uppercase tracking-widest text-(--text-primary) opacity-50">
          {title}
        </p>
        {description && (
          <p className="mt-1 font-interface text-sm text-(--text-muted)">
            {description}
          </p>
        )}
      </div>
      {children}
      {footer && <div className="flex justify-end gap-2 pt-3">{footer}</div>}
    </section>
  );
}