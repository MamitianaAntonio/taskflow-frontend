import { type ReactNode } from "react";
import HeaderMeta, { type HeaderMetaTone } from "./HeaderMeta";

export interface PageHeaderMeta {
  label: string;
  tone?: HeaderMetaTone;
}

interface PageHeaderProps {
  title: string;
  highlight?: string;
  description: string;
  icon?: ReactNode;
  meta?: PageHeaderMeta[];
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  highlight,
  description,
  icon,
  meta,
  actions,
  footer,
  className = "",
}: PageHeaderProps) {
  const hasMeta = Boolean(meta?.length);

  return (
    <header className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* Title and description */}
        <div className="min-w-0">
          <h1 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-(--text-primary) sm:text-2xl">
            {icon && (
              <span className="flex shrink-0 items-center text-(--text-secondary)">
                {icon}
              </span>
            )}

            <span className="min-w-0">
              {title}
              {highlight && (
                <span className="ml-1 text-(--accent-strong)">
                  {highlight}
                </span>
              )}
            </span>
          </h1>

          <p className="mt-1 max-w-xl text-xs leading-relaxed text-(--text-muted) sm:text-[13px]">
            {description}
          </p>
        </div>

        {/* Metadata and actions */}
        {(hasMeta || actions) && (
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {meta?.map((item) => (
              <HeaderMeta key={item.label} tone={item.tone}>
                {item.label}
              </HeaderMeta>
            ))}

            {actions}
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-1">
          {footer}
        </div>
      )}
    </header>
  );
}
