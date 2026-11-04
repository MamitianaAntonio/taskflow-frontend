import { Fragment, type ReactNode } from "react";
import HeaderMeta, { type HeaderMetaTone } from "./HeaderMeta";

export interface PageHeaderMeta {
  label: string;
  tone?: HeaderMetaTone;
}

interface PageHeaderProps {
  title: string;
  highlight: string;
  description: string;
  meta?: PageHeaderMeta[];
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  highlight,
  description,
  meta,
  actions,
  footer,
  className = "",
}: PageHeaderProps) {
  const hasMeta = Boolean(meta?.length);

  return (
    <header className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary) sm:text-3xl">
            {title}{" "}
            <span className="bg-linear-to-r from-(--gradient-from) to-(--gradient-to) bg-clip-text text-transparent">
              {highlight}
            </span>
          </h1>

          <p className="mt-1.5 max-w-xl font-interface text-sm text-(--text-muted)">
            {description}
          </p>
        </div>

        {(hasMeta || actions) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:justify-end">
            {meta?.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 && (
                  <span aria-hidden="true" className="text-(--text-muted)/40">
                    ·
                  </span>
                )}
                <HeaderMeta tone={item.tone}>{item.label}</HeaderMeta>
              </Fragment>
            ))}

            {actions}
          </div>
        )}
      </div>

      {footer}
    </header>
  );
}
