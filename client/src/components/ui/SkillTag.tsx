interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
}

export function SkillTag({ skill, onRemove }: SkillTagProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e0f3ff] px-2.5 py-0.5 text-xs font-medium text-[#0284c7]">
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-[#0284c7] hover:text-[#0369a1] leading-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
