import { cn } from "@/lib/utils";

export default function StatCard({ label, value, hint, icon: Icon, tint = "text-primary bg-primary/10" }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg", tint)}>
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
        )}
      </div>
      <p className="mt-3 font-heading text-[24px] font-extrabold leading-none tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
