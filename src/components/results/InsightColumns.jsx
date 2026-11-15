import { AlertTriangle, CheckCircle2, Flag } from "lucide-react";

const blocks = [
  {
    key: "strengths",
    label: "What landed",
    icon: CheckCircle2,
    tint: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  {
    key: "weakAreas",
    label: "Where you slipped",
    icon: AlertTriangle,
    tint: "bg-rose-50 text-rose-600",
    dot: "bg-rose-500",
  },
  {
    key: "focusAreas",
    label: "Rehearse next",
    icon: Flag,
    tint: "bg-primary/10 text-primary",
    dot: "bg-primary",
  },
];

export default function InsightColumns({ strengths = [], weakAreas = [], focusAreas = [] }) {
  const data = { strengths, weakAreas, focusAreas };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {blocks.map((block) => {
        const items = data[block.key] || [];
        return (
          <div key={block.key} className="rounded-2xl border border-border bg-white p-4">
            <p className="flex items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-wide text-slate-700">
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${block.tint}`}>
                <block.icon className="h-3.5 w-3.5" />
              </span>
              {block.label}
            </p>
            {items.length === 0 ? (
              <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">Nothing recorded.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <li key={`${block.key}-${index}`} className="flex gap-2 text-[11.5px] leading-relaxed text-slate-600">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${block.dot}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
