const steps = [
  {
    n: "01",
    title: "Upload your notes",
    body: "Drop a PDF, DOCX, PPTX, TXT or RTF from your course. It stays in your private library.",
  },
  {
    n: "02",
    title: "We map the topics",
    body: "The text is read and reduced to 5–7 major exam topics, each with a one-line summary and an importance rank.",
  },
  {
    n: "03",
    title: "Sit the viva",
    body: "Pick a topic or let VivaAI choose. The examiner speaks first, listens, and pushes on the gaps — you just talk.",
  },
  {
    n: "04",
    title: "Get the debrief",
    body: "Score, strengths, weak areas, topic mastery and a focused study plan for your next session.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">How a viva runs</p>
            <h2 className="mt-3 font-heading text-[30px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[38px]">
              Four steps. About fifteen minutes.
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">No scripts · No flashcards</p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="bg-white p-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{step.n}</span>
              <h3 className="mt-6 font-heading text-[15px] font-bold tracking-tight text-slate-900">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
