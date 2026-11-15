import { useState } from "react";
import { ClipboardPaste, FileUp } from "lucide-react";
import FileMaterialForm from "./FileMaterialForm";
import PasteMaterialForm from "./PasteMaterialForm";
import { cn } from "@/lib/utils";

const MODES = [
  { key: "file", label: "Upload a file", icon: FileUp },
  { key: "paste", label: "Paste notes", icon: ClipboardPaste },
];

export default function UploadPanel({ subjects = [], onComplete }) {
  const [mode, setMode] = useState("file");
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
      <h2 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">Add course material</h2>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Upload a file or paste your notes. Stored privately, only used to build your viva.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1">
        {MODES.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={busy}
            onClick={() => setMode(item.key)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors disabled:opacity-60",
              mode === item.key
                ? "bg-white text-slate-900 shadow-soft"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {mode === "file" ? (
          <FileMaterialForm subjects={subjects} onComplete={onComplete} onBusyChange={setBusy} />
        ) : (
          <PasteMaterialForm onComplete={onComplete} onBusyChange={setBusy} />
        )}
      </div>
    </div>
  );
}
