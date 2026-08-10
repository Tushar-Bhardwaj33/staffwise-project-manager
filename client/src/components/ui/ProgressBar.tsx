import { useEffect, useState, useMemo } from "react";

interface ProgressBarProps {
  startDate: string;
  endDate: string;
}

export function ProgressBar({ startDate, endDate }: ProgressBarProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const { pct, status } = useMemo(() => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const total = Math.max(1, end - start);
    let pct = 0;
    let status: "upcoming" | "active" | "completed" = "active";

    if (now < start) {
      pct = 0;
      status = "upcoming";
    } else if (now > end) {
      pct = 100;
      status = "completed";
    } else {
      const exactPct = ((now - start) / total) * 100;
      // If it's active, guarantee at least 1% so the bar is visibly started
      pct = Math.max(1, Math.min(100, Math.round(exactPct)));
    }

    return { pct, status };
  }, [startDate, endDate, now]);

  const barColor =
    status === "completed"
      ? "bg-emerald-500"
      : status === "upcoming"
      ? "bg-slate-300"
      : "bg-blue-600";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {new Date(startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>
          {new Date(endDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500">
        {status === "completed"
          ? "Completed"
          : status === "upcoming"
          ? "Upcoming"
          : `${pct}% elapsed`}
      </div>
    </div>
  );
}
