import { AlertTriangle, Headphones, Mic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIFFICULTY_COPY, IMPORTANCE_STYLES } from "@/lib/study";
import { cn } from "@/lib/utils";

export default function VivaSetup({
  materials,
  topics,
  materialId,
  onMaterialChange,
  selectedTopics,
  onToggleTopic,
  difficulty,
  onDifficultyChange,
  onStart,
  busy,
  error,
  agentConfigured,
}) {
  const material = materials.find((item) => item.id === materialId) || null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
      <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
        <h2 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">Set up your viva</h2>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Pick the material and the topics you want to be questioned on. The examiner stays inside them.
        </p>

        <div className="mt-4 space-y-1.5">
          <label htmlFor="viva-material" className="text-[11.5px] font-semibold text-slate-700">
            Material
          </label>
          <select
            id="viva-material"
            value={materialId}
            onChange={(event) => onMaterialChange(event.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-white px-3 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {materials.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} {item.subject ? `· ${item.subject}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] font-semibold text-slate-700">Topics</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {selectedTopics.length} selected
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {topics.length === 0 && (
              <p className="text-[12px] text-muted-foreground">This material has no topics yet.</p>
            )}
            {topics.map((topic) => {
              const active = selectedTopics.includes(topic.name);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onToggleTopic(topic.name)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {topic.name}
                </button>
              );
            })}
          </div>
          {topics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topics
                .filter((topic) => topic.importance === "high")
                .slice(0, 1)
                .map((topic) => (
                  <span
                    key={`${topic.id}-badge`}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ring-1",
                      IMPORTANCE_STYLES.high,
                    )}
                  >
                    High importance
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[11.5px] font-semibold text-slate-700">Difficulty</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {Object.entries(DIFFICULTY_COPY).map(([key, copy]) => (
              <button
                key={key}
                type="button"
                onClick={() => onDifficultyChange(key)}
                className={cn(
                  "rounded-xl border px-2.5 py-2 text-left transition-colors",
                  difficulty === key ? "border-primary bg-primary/5" : "border-border bg-white hover:border-slate-300",
                )}
              >
                <span
                  className={cn(
                    "block font-heading text-[12px] font-bold tracking-tight",
                    difficulty === key ? "text-primary" : "text-slate-900",
                  )}
                >
                  {copy.label}
                </span>
                <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">{copy.description}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-relaxed text-destructive">
            {error}
          </p>
        )}

        <Button
          type="button"
          onClick={onStart}
          disabled={busy || !agentConfigured || !topics.length}
          className="mt-5 w-full rounded-full text-[13px] font-semibold"
        >
          <Mic className="mr-2 h-4 w-4" />
          {busy ? "Preparing…" : "Start the viva"}
        </Button>
        {!agentConfigured && (
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Add your ElevenLabs agent id to enable the spoken examiner.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-border bg-white p-5">
          <p className="eyebrow">Before you start</p>
          <ul className="mt-3 space-y-3">
            {[
              { icon: Headphones, text: "Use headphones. The examiner listens while it speaks." },
              { icon: Mic, text: "Answer out loud, in full sentences — nothing is typed." },
              { icon: Play, text: "A viva runs 8–12 questions. You can end it whenever you like." },
            ].map((item) => (
              <li key={item.text} className="flex gap-2.5">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <item.icon className="h-3.5 w-3.5 text-slate-500" />
                </span>
                <span className="text-[12px] leading-relaxed text-slate-600">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {!agentConfigured && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-2 font-heading text-[12.5px] font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              Voice examiner not configured
            </p>
            <p className="mt-2 text-[11.5px] leading-relaxed text-amber-800">
              Create a conversational agent in ElevenLabs with the tools <code>get_topic_notes</code> and{" "}
              <code>end_session</code>, then add its id as <code>VITE_ELEVENLABS_AGENT_ID</code>.
            </p>
          </div>
        )}

        {material && (
          <div className="rounded-3xl border border-border bg-slate-50/70 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Session source</p>
            <p className="mt-1.5 font-heading text-[13px] font-bold tracking-tight text-slate-900">{material.title}</p>
            <p className="mt-0.5 text-[11.5px] text-slate-600">
              {material.subject || "No subject"} · {topics.length} topics extracted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
