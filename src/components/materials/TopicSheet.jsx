import { Link } from "react-router-dom";
import { Mic, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IMPORTANCE_STYLES } from "@/lib/study";
import { cn } from "@/lib/utils";

export default function TopicSheet({ topic, open, onOpenChange, materialId, subject }) {
  if (!topic) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide ring-1",
                IMPORTANCE_STYLES[topic.importance] || IMPORTANCE_STYLES.medium,
              )}
            >
              {topic.importance || "medium"} importance
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">{subject}</span>
          </div>
          <DialogTitle className="mt-1 text-left font-heading text-[19px] font-extrabold tracking-tight">
            {topic.name}
          </DialogTitle>
          <DialogDescription className="text-left text-[13px] leading-relaxed text-slate-600">
            {topic.summary || "No summary was extracted for this topic yet."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 rounded-2xl border border-border bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
              <Target className="h-3 w-3" />
              Mastery
            </p>
            <p className="font-mono text-[11px] font-semibold text-slate-700">{Math.round(topic.mastery || 0)}%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full brand-gradient"
              style={{ width: `${Math.min(100, Math.max(2, topic.mastery || 0))}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Mastery updates after every viva that covers this topic.
          </p>
        </div>

        <Button asChild className="mt-4 w-full rounded-full text-[13px] font-semibold">
          <Link to={`/exam?material=${materialId}&topic=${encodeURIComponent(topic.name)}`}>
            <Mic className="mr-2 h-4 w-4" />
            Launch a viva on this topic
          </Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
