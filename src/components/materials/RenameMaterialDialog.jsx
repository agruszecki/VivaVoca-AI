import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RenameMaterialDialog({ material, open, onOpenChange, onSaved }) {
  const [title, setTitle] = useState(material?.title || "");
  const [subject, setSubject] = useState(material?.subject || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(material?.title || "");
      setSubject(material?.subject || "");
      setError("");
    }
  }, [open, material]);

  const save = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.StudyMaterial.update(material.id, {
        title: title.trim(),
        subject: subject.trim(),
      });
      if (subject.trim() && subject.trim() !== material?.subject) {
        await base44.entities.Topic.updateMany({ material_id: material.id }, { $set: { subject: subject.trim() } });
      }
      onOpenChange(false);
      await onSaved?.();
    } catch (err) {
      setError(err.message || "Could not save the changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>Rename material</DialogTitle>
            <DialogDescription>Only your library changes — the file itself stays untouched.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="rename-title" className="text-[12px] font-semibold">
                Title
              </Label>
              <Input id="rename-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rename-subject" className="text-[12px] font-semibold">
                Subject
              </Label>
              <Input id="rename-subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
            </div>
            {error && <p className="text-[12px] text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="rounded-full px-4">
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
