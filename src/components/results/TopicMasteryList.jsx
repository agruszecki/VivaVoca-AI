import { cn } from "@/lib/utils";

function barTint(score) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 55) return "bg-amber-500";
  return "bg-rose-500";
}

export default function TopicMasteryList({ topicScores = [] }) {
  if (!topicScores.length) {
    return <p className="text-[12px] leading-relaxed text-muted-foreground">No per-topic scores were recorded in this viva.</p>;
  }

  return (
    <ul className="space-y-3">
      {topicScores.map((entry, index) => (
        <li key={`${entry.topic}-${index}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-heading text-[12px] font-semibold tracking-tight text-slate-800">{entry.topic}</p>
            <span className="font-mono text-[11px] font-semibold text-slate-500">
              {Math.round(Number(entry.score) || 0)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn("h-full rounded-full", barTint(Number(entry.score) || 0))}
              style={{ width: `${Math.min(100, Math.max(2, Number(entry.score) || 0))}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
