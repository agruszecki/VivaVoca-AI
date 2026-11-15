import { Link } from "react-router-dom";
import { CalendarCheck, Clock, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudyPlanCard({ plan, subject }) {
  if (!plan) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/60 p-5">
        <p className="font-heading text-[12.5px] font-bold text-slate-900">No study plan for this viva</p>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
          The examiner writes one when it closes the session itself. Sit another viva to get a focused plan.
        </p>
        <Button asChild variant="outline" className="mt-3 rounded-full text-[12px] font-semibold">
          <Link to="/exam">
            <Mic className="mr-1.5 h-3.5 w-3.5" />
            Start a viva
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-heading text-[12.5px] font-bold tracking-tight text-slate-900">
          <CalendarCheck className="h-4 w-4 text-emerald-600" />
          Your next 45 minutes
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-500">
          <Clock className="h-3 w-3" />
          {plan.study_time_minutes || 45} min
        </span>
      </div>

      <p className="mt-3 text-[11.5px] text-muted-foreground">
        Priority topic · <span className="font-semibold text-slate-800">{plan.priority_topic}</span>
      </p>

      <ol className="mt-3 space-y-2.5">
        {(plan.activities || []).map((activity, index) => (
          <li key={index} className="flex gap-2.5 rounded-xl bg-slate-50/80 p-3">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white font-mono text-[9px] font-semibold text-slate-500 ring-1 ring-border">
              {index + 1}
            </span>
            <span className="text-[11.5px] leading-relaxed text-slate-600">{activity}</span>
          </li>
        ))}
      </ol>

      <Button asChild className="mt-4 w-full rounded-full text-[12.5px] font-semibold">
        <Link to="/exam">
          <Mic className="mr-2 h-3.5 w-3.5" />
          Test this plan in a viva
        </Link>
      </Button>
    </div>
  );
}
