import type { ReactNode } from "react";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-bg px-5 py-7 sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
