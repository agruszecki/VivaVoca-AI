import { IMPORTANCE_STYLES } from "@/lib/study";
import { cn } from "@/lib/utils";

export default function TopicGrid({ topics = [], onOpen, emptyHint }) {
  if (!topics.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/60 px-5 py-8 text-center">
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => onOpen(topic)}
          className="group rounded-2xl border border-border bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-heading text-[12.5px] font-bold leading-snug tracking-tight text-slate-900">{topic.name}</p>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ring-1",
                IMPORTANCE_STYLES[topic.importance] || IMPORTANCE_STYLES.medium,
              )}
            >
              {topic.importance || "medium"}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted-foreground">{topic.summary}</p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full brand-gradient"
                style={{ width: `${Math.min(100, Math.max(2, topic.mastery || 0))}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{Math.round(topic.mastery || 0)}%</span>
          </div>
        </button>
      ))}
    </div>
  );
}
