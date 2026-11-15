import { useState } from "react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RenameMaterialDialog from "./RenameMaterialDialog";
import { formatRelativeDate } from "@/lib/study";
import { cn } from "@/lib/utils";

export default function MaterialCard({ material, topicCount = 0, active, onSelect, onChanged, demo = false }) {
  const [renaming, setRenaming] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.entities.Topic.deleteMany({ material_id: material.id });
      await base44.entities.MaterialChunk.deleteMany({ material_id: material.id }).catch(() => {});
      await base44.entities.StudyMaterial.delete(material.id);
      setConfirming(false);
      await onChanged?.();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white p-4 transition-all",
        active ? "border-primary/40 shadow-soft ring-1 ring-primary/15" : "border-border hover:border-slate-300",
      )}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-start gap-3 text-left">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <FileText className="h-4 w-4 text-slate-500" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-heading text-[13px] font-bold tracking-tight text-slate-900">
            {material.title}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
            {material.subject || "No subject"} · {material.file_type?.toUpperCase() || "FILE"}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {topicCount} topics
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                material.status === "analyzed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-700",
              )}
            >
              {material.status === "analyzed" ? "Analyzed" : "Analyzing"}
            </span>
            {demo && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Demo</span>
            )}
            <span className="text-[10px] text-muted-foreground">{formatRelativeDate(material.created_date)}</span>
          </span>
        </span>
      </button>

      {!demo && (
      <div className="mt-3 flex items-center justify-end gap-1 border-t border-border/70 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setRenaming(true)}
          className="h-7 rounded-full px-2 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
        >
          <Pencil className="mr-1 h-3 w-3" />
          Rename
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(true)}
          className="h-7 rounded-full px-2 text-[11px] font-semibold text-slate-500 hover:text-destructive"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Delete
        </Button>
      </div>
      )}

      <RenameMaterialDialog material={material} open={renaming} onOpenChange={setRenaming} onSaved={onChanged} />

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{material.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the material, its {topicCount} topics and its indexed notes. Vivas you already recorded stay in your
              results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete material"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
