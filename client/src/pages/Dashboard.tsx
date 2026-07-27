// src/pages/Dashboard.tsx
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-border bg-surface-raised px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Staffwise
          </span>
        </div>
        <button
          onClick={() => void logout()}
          className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          Log out
        </button>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="mb-4 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
          In progress
        </span>

        <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.name}</h1>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          Your dashboard is still being built — projects, teams, and documents
          will show up here soon. For now, here&apos;s what we know about you:
        </p>

        <dl className="mt-8 w-full max-w-xs space-y-2 rounded-lg border border-border bg-surface-raised p-6 text-left text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-ink">Employee ID</dt>
            <dd className="text-ink-soft">{user?.employeeId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium text-ink">Role</dt>
            <dd className="text-ink-soft">{user?.role}</dd>
          </div>
        </dl>

        <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/3 rounded-full bg-brand" />
        </div>
        <p className="mt-2 text-xs text-ink-soft">Auth &amp; theme done — pages next</p>
      </main>
    </div>
  );
}