import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadFeedback from "./UploadFeedback";
import { indexMaterial } from "@/lib/materialIntake";
import {
  fileTypeFromName,
  titleFromFileName,
  formatFileSize,
  MAX_FILE_MB,
  MAX_FILE_BYTES,
  SUPPORTED_EXTENSIONS,
} from "@/lib/study";

export default function FileMaterialForm({ subjects = [], onComplete, onBusyChange }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const pickFile = (next) => {
    if (!next) return;
    if (!fileTypeFromName(next.name)) {
      clearFile();
      setError(`“${next.name}” is not supported. Use ${SUPPORTED_EXTENSIONS.join(", ").toUpperCase()}.`);
      return;
    }
    if (next.size > MAX_FILE_BYTES) {
      clearFile();
      setError(`“${next.name}” is ${formatFileSize(next.size)}. The limit is ${MAX_FILE_MB} MB per file.`);
      return;
    }
    setFile(next);
    setError("");
    if (!title.trim()) setTitle(titleFromFileName(next.name));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      clearFile();
      setError(`“${file.name}” is ${formatFileSize(file.size)}. The limit is ${MAX_FILE_MB} MB per file.`);
      return;
    }
    if (!subject.trim()) {
      setError("Add the subject this material belongs to.");
      return;
    }

    setBusy(true);
    onBusyChange?.(true);
    setError("");
    let created = null;
    const subjectValue = subject.trim();
    const fileType = fileTypeFromName(file.name);

    try {
      setStage("Uploading your file…");
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });

      setStage("Reading your notes…");
      created = await base44.entities.StudyMaterial.create({
        title: title.trim() || titleFromFileName(file.name),
        subject: subjectValue,
        file_name: file.name,
        file_type: fileType,
        file_uri,
        status: "analyzing",
      });

      const response = await base44.functions.invoke("analyzeMaterial", {
        file_uri,
        file_name: file.name,
      });
      const topics = response.data?.topics || [];
      const text = response.data?.text || "";

      await indexMaterial({
        materialId: created.id,
        subject: subjectValue,
        topics,
        text,
        note: response.data?.note || "",
        onStage: setStage,
      });

      setFile(null);
      setTitle("");
      setSubject("");
      if (inputRef.current) inputRef.current.value = "";
      await onComplete?.();
    } catch (err) {
      if (created) {
        await base44.entities.StudyMaterial.delete(created.id).catch(() => {});
      }
      setError(err?.response?.data?.error || err.message || "That upload did not finish. Please try again.");
    } finally {
      setBusy(false);
      onBusyChange?.(false);
      setStage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          pickFile(event.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border bg-slate-50/60"
        }`}
      >
        {file ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 shadow-soft">
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 text-left">
                <p className="truncate text-[12.5px] font-semibold text-slate-900">{file.name}</p>
                <p className="text-[10.5px] text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Upload className="h-[18px] w-[18px] text-primary" />
            </span>
            <p className="mt-3 text-[12.5px] font-semibold text-slate-900">Drop your notes here</p>
            <p className="mt-1 text-[11.5px] text-muted-foreground">or</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              className="mt-2 rounded-full text-[12px] font-semibold"
            >
              Browse files
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.pptx,.txt,.rtf"
          className="hidden"
          onChange={(event) => pickFile(event.target.files?.[0])}
        />
      </div>

      <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground">
        {SUPPORTED_EXTENSIONS.join(", ").toUpperCase()} · up to {MAX_FILE_MB} MB per file
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="material-title" className="text-[11.5px] font-semibold text-slate-700">
            Title
          </Label>
          <Input
            id="material-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Lecture 4 — Memory systems"
            className="h-9 text-[13px]"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="material-subject" className="text-[11.5px] font-semibold text-slate-700">
            Subject
          </Label>
          <Input
            id="material-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Cognitive Neuroscience"
            list="subject-options"
            className="h-9 text-[13px]"
          />
          <datalist id="subject-options">
            {subjects.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
      </div>

      <UploadFeedback error={error} busy={busy} stage={stage} />

      <Button
        type="submit"
        disabled={busy || !file || file.size > MAX_FILE_BYTES}
        className="mt-4 w-full rounded-full text-[13px] font-semibold sm:w-auto sm:px-6"
      >
        {busy ? "Analyzing…" : "Analyze material"}
      </Button>
    </form>
  );
}
