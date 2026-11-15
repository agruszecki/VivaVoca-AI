import { Loader2 } from "lucide-react";

export default function UploadFeedback({ error, busy, stage }) {
  if (error) {
    return (
      <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-[12px] leading-relaxed text-destructive">
        {error}
      </p>
    );
  }
  if (!busy) return null;
  return (
    <div className="mt-3 space-y-1.5 rounded-xl bg-primary/5 px-3 py-2">
      <p className="flex items-center gap-2 text-[12px] font-medium text-primary">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {stage || "Working…"}
      </p>
      <p className="pl-[22px] text-[11px] leading-relaxed text-muted-foreground">
        This usually takes a few seconds. Keep this page open.
      </p>
    </div>
  );
}
