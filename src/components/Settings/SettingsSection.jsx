export default function SettingsSection({ title, description, children, footer }) {
  return (
    <section className="flex flex-col">
      <div className="mb-4">
        <p className="text-xs font-semibold text-(--text-primary) opacity-50 uppercase tracking-widest font-interface">
          {title}
        </p>
        {description && (
          <p className="text-sm text-(--text-muted) mt-1 font-interface">
            {description}
          </p>
        )}
      </div>
      {children}
      {footer && (
        <div className="flex justify-end gap-2 pt-3 border-t border-(--border-color)">
          {footer}
        </div>
      )}
    </section>
  );
}