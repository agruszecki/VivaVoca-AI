import { useEffect, useRef } from "react";
import { AlertCircle, Mic, PhoneOff, Volume2 } from "lucide-react";
import VoiceOrb from "./VoiceOrb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusCopy = {
  connecting: "Connecting to your examiner…",
  live: "Live — answer out loud",
  ended: "Session finished",
  error: "Connection problem",
};

export default function VivaStage({ status, messages, agentSpeaking, onEnd, subject, topics, error, elapsed }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [messages]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Live viva</p>
          <p className="mt-1 font-heading text-[15px] font-bold tracking-tight text-slate-900">{subject}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em]",
            status === "live" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500",
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 rounded-full", status === "live" ? "bg-emerald-500" : "bg-slate-400")}
          />
          {statusCopy[status] || status}
        </span>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-slate-50/80 px-5 py-8">
        <VoiceOrb speaking={agentSpeaking} listening={status === "live" && !agentSpeaking} />
        <p className="mt-4 font-heading text-[13px] font-semibold tracking-tight text-slate-900">
          {agentSpeaking ? "Examiner is speaking…" : status === "live" ? "Examiner is listening…" : statusCopy[status]}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {(topics || []).slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {topic}
            </span>
          ))}
          {(topics || []).length > 4 && (
            <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500">
              +{(topics || []).length - 4}
            </span>
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{elapsed}</p>
      </div>

      {error && (
        <div className="flex items-start gap-2 border-t border-border/70 bg-destructive/5 px-5 py-3 text-[12px] leading-relaxed text-destructive">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="border-t border-border/70 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Transcript</p>
        <div ref={scrollerRef} className="mt-2 max-h-[240px] space-y-2.5 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <p className="py-6 text-center text-[12px] text-muted-foreground">
              Your examiner will start speaking in a moment. Turn your sound on.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                message.role === "agent" ? "bg-secondary/5 text-slate-700" : "bg-slate-100/80 text-slate-600",
              )}
            >
              <span className="mt-0.5 shrink-0">
                {message.role === "agent" ? (
                  <Volume2 className="h-3.5 w-3.5 text-secondary" />
                ) : (
                  <Mic className="h-3.5 w-3.5 text-slate-400" />
                )}
              </span>
              <span>{message.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/70 bg-white px-5 py-3">
        <Button
          type="button"
          variant="outline"
          onClick={onEnd}
          className="w-full rounded-full border-destructive/30 text-[12.5px] font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <PhoneOff className="mr-2 h-3.5 w-3.5" />
          End the viva
        </Button>
      </div>
    </div>
  );
}
