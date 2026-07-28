interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = "◫", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl text-[#e3e8ee]">{icon}</div>
      <h3 className="text-base font-semibold text-[#0f1419]">{title}</h3>
      {description && <p className="mt-1 text-sm text-[#9ca3af] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}