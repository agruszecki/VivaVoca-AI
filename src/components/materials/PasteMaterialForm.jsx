import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UploadFeedback from "./UploadFeedback";
import { indexMaterial } from "@/lib/materialIntake";

const MIN_CHARS = 60;

function fileNameFor(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${slug || "pasted-notes"}.txt`;
}

export default function PasteMaterialForm({ onComplete, onBusyChange }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pasted = text.trim();
    if (pasted.length < MIN_CHARS) {
      setError("Paste at least a paragraph of notes first.");
      return;
    }

    setBusy(true);
    onBusyChange?.(true);
    setError("");
    let created = null;

    try {
      setStage("Reading your notes…");
      const response = await base44.functions.invoke("analyzeMaterial", { text: pasted });
      const data = response.data || {};
      const topics = Array.isArray(data.topics) ? data.topics : [];
      const title = (data.title || "Pasted notes").slice(0, 120);
      const subject = (data.subject || "").slice(0, 80);

      setStage("Filing it under its subject…");
      created = await base44.entities.StudyMaterial.create({
        title,
        subject,
        file_name: fileNameFor(title),
        file_type: "txt",
        status: "analyzing",
      });

      await indexMaterial({
        materialId: created.id,
        subject,
        topics,
        text: data.text || pasted,
        note: data.note || "",
        onStage: setStage,
      });

      setText("");
      await onComplete?.();
    } catch (err) {
      if (created) {
        await base44.entities.StudyMaterial.delete(created.id).catch(() => {});
      }
      setError(err?.response?.data?.error || err.message || "Those notes could not be analyzed. Please try again.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      setStage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Paste your lecture notes, slides text, reading summary or essay here…"
        disabled={busy}
        className="min-h-[184px] resize-y rounded-2xl border-border bg-slate-50/60 text-[12.5px] leading-relaxed"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-[10.5px] text-muted-foreground">
          The title and subject are detected from your notes.
        </p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {text.trim().length} chars
        </span>
      </div>

      <UploadFeedback error={error} busy={busy} stage={stage} />

      <Button type="submit" disabled={busy} className="mt-4 w-full rounded-full text-[13px] font-semibold sm:w-auto sm:px-6">
        {busy ? "Analyzing…" : "Analyze pasted notes"}
      </Button>
    </form>
  );
}
