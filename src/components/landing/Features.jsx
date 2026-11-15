import { ScanText, AudioLines, BookOpenCheck, Gauge, Target, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: ScanText,
    title: "Your notes, not a textbook",
    body: "Every upload is extracted and mapped to 5–7 major exam topics — the ones actually present in your material, never invented.",
    tint: "text-primary bg-primary/10",
  },
  {
    icon: AudioLines,
    title: "It speaks, you speak",
    body: "A conversational AI examiner runs the viva out loud. Follow-up questions when your answer is thin, silence when you stall.",
    tint: "text-secondary bg-secondary/10",
  },
  {
    icon: BookOpenCheck,
    title: "It re-reads your material mid-answer",
    body: "The examiner pulls the exact lecture text for the topic it is questioning you on, so nothing drifts off your syllabus.",
    tint: "text-accent bg-accent/10",
  },
  {
    icon: Gauge,
    title: "Three levels of pressure",
    body: "Easy warms you up, medium mirrors a standard viva, hard is the examiner who will not let a vague answer pass.",
    tint: "text-amber-600 bg-amber-100",
  },
  {
    icon: Target,
    title: "A score, not a vibe",
    body: "Strengths, weak areas and per-topic mastery — measured against what you were expected to say, question by question.",
    tint: "text-emerald-600 bg-emerald-100",
  },
  {
    icon: CalendarCheck,
    title: "A plan for tomorrow",
    body: "The report ends in a 45-minute study plan aimed at your weakest topic, with three concrete activities.",
    tint: "text-rose-600 bg-rose-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-border/70 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <p className="eyebrow">What you get</p>
          <h2 className="mt-3 font-heading text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[38px]">
            Built for the exam you can’t revise by highlighting.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-slate-600">
            Oral exams test retrieval under pressure. VivaAI trains exactly that — with your material as the only source of truth.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-border bg-slate-50/60 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-white hover:shadow-soft"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${feature.tint}`}>
                <feature.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-heading text-[15px] font-bold tracking-tight text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
