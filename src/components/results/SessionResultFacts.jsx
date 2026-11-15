import { AlertTriangle, CheckCircle2, Flag } from "lucide-react";

const blocks = [
  { key: "strongest", label: "Strongest topic", icon: CheckCircle2, tint: "bg-emerald-50 text-emerald-600" },
  { key: "weakest", label: "Weakest topic", icon: AlertTriangle, tint: "bg-rose-50 text-rose-600" },
  { key: "review", label: "Review first", icon: Flag, tint: "bg-primary/10 text-primary" },
];

export default function SessionResultFacts({ strongestTopic, weakestTopic, recommendedReview }) {
  if (!strongestTopic && !weakestTopic && !recommendedReview) return null;
  const data = { strongest: strongestTopic, weakest: weakestTopic, review: recommendedReview };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {blocks.map((block) => (
        <div key={block.key} className="rounded-2xl border border-border bg-white p-4">
          <p className="flex items-center gap-2 font-heading text-[11.5px] font-bold uppercase tracking-wide text-slate-700">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${block.tint}`}>
              <block.icon className="h-3.5 w-3.5" />
            </span>
            {block.label}
          </p>
          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-600">
            {data[block.key] || "Not recorded in this session."}
          </p>
        </div>
      ))}
    </div>
  );
}
