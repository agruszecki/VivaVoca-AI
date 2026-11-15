import { Link } from "react-router-dom";
import { ChevronRight, Mic } from "lucide-react";
import { formatRelativeDate } from "@/lib/study";
import { cn } from "@/lib/utils";

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-600",
  in_progress: "bg-blue-50 text-blue-600",
  scheduled: "bg-slate-100 text-slate-500",
};

const statusLabels = {
  completed: "Completed",
  in_progress: "In progress",
  scheduled: "Scheduled",
};

export default function RecentSessions({ sessions = [] }) {
  if (!sessions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-center">
        <Mic className="mx-auto h-5 w-5 text-slate-300" />
        <p className="mt-3 font-heading text-[13px] font-bold text-slate-900">No vivas yet</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Your first spoken exam will appear here with its score.</p>
        <Link
          to="/exam"
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-white"
        >
          Start a viva
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <ul className="divide-y divide-border/70">
        {sessions.map((session) => (
          <li key={session.id}>
            <Link
              to={`/results?session=${session.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/70"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-[13px] font-bold tracking-tight text-slate-900">
                  {session.subject || "Viva"}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {(session.topic_names || []).slice(0, 2).join(" · ") || "No topics recorded"}
                  {session.topic_names?.length > 2 ? ` +${session.topic_names.length - 2}` : ""}
                </span>
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">{formatRelativeDate(session.created_date)}</span>
              {typeof session.overall_score === "number" && (
                <span className="font-mono text-[12px] font-semibold text-slate-700">{session.overall_score}</span>
              )}
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  statusStyles[session.status] || statusStyles.scheduled,
                )}
              >
                {statusLabels[session.status] || session.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
