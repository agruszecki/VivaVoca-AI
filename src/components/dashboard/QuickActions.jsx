import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, Mic, Upload } from "lucide-react";

const actions = [
  {
    to: "/materials",
    label: "Upload notes",
    description: "Add a lecture and map its exam topics",
    icon: Upload,
    tint: "bg-primary/10 text-primary",
  },
  {
    to: "/exam",
    label: "Start a viva",
    description: "Speak with the examiner right now",
    icon: Mic,
    tint: "bg-secondary/10 text-secondary",
  },
  {
    to: "/results",
    label: "Review results",
    description: "Scores, weak areas and your study plan",
    icon: BarChart3,
    tint: "bg-emerald-100 text-emerald-600",
  },
];

export default function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex items-start gap-3 rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
        >
          <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${action.tint}`}>
            <action.icon className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1 font-heading text-[13px] font-bold tracking-tight text-slate-900">
              {action.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
            <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted-foreground">{action.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
