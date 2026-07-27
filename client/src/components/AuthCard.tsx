import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Staffwise
          </span>
        </div>

        <div className="rounded-lg border border-border bg-surface-raised p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-semibold text-ink">{title}</h1>
          {children}
        </div>

        {footer && <div className="mt-4 text-center text-sm text-ink-soft">{footer}</div>}
      </div>
    </div>
  );
}