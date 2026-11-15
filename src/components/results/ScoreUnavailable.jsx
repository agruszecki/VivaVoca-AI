import { MinusCircle } from "lucide-react";

export default function ScoreUnavailable() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-white p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
        <MinusCircle className="h-5 w-5 text-slate-400" />
      </span>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Overall score</p>
        <p className="mt-1 font-heading text-[14px] font-bold tracking-tight text-slate-900">
          Score not available for this session
        </p>
      </div>
    </div>
  );
}
