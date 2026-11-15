import { Mic, Volume2 } from "lucide-react";

const chips = ["Working memory", "Neuroplasticity", "Long-term potentiation", "Attention networks"];

const bars = [14, 26, 38, 22, 46, 30, 52, 36, 20, 42, 28, 16];

export default function ProductVisual() {
  return (
    <div className="relative">
      <div className="absolute -right-6 -top-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-10 -left-8 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" aria-hidden />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-lift">
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Live viva</p>
            <p className="mt-1 font-heading text-sm font-bold tracking-tight">Cognitive Neuroscience</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            In session
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 py-4">
          {chips.map((chip, i) => (
            <span
              key={chip}
              className={
                i === 0
                  ? "rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white"
                  : "rounded-full border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
              }
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 py-8">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="animate-orb absolute inset-0 rounded-full brand-gradient opacity-60 blur-md" />
            <span className="absolute inset-3 rounded-full border border-white/70" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-soft">
              <Mic className="h-5 w-5 text-primary" strokeWidth={2.2} />
            </span>
          </div>
          <p className="mt-4 font-heading text-[13px] font-semibold tracking-tight">Examiner is listening…</p>
          <div className="mt-3 flex h-8 items-center gap-[3px]">
            {bars.map((h, i) => (
              <span
                key={i}
                className="animate-orb w-[3px] rounded-full bg-primary/40"
                style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/80 bg-white p-3.5">
          <div className="flex items-start gap-2.5">
            <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p className="text-[11.5px] leading-relaxed text-slate-600">
              “You mentioned long-term potentiation. Explain why repeated stimulation strengthens a synapse, and what happens
              if the stimulus is weak.”
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Question 3</span>
          <span>12:45</span>
          <span className="text-primary">Medium</span>
        </div>
      </div>

      <div className="absolute -bottom-6 right-4 rounded-2xl border border-border bg-white px-4 py-3 shadow-lift">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Topic mastery</p>
        <p className="mt-1 font-heading text-lg font-extrabold tracking-tight text-emerald-600">
          88<span className="text-[11px] text-muted-foreground">/100</span>
        </p>
      </div>
    </div>
  );
}
