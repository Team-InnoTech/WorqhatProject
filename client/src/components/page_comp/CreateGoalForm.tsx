import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { goals } from "../../types/goals";
import { toast } from "sonner";
import { uploadFileToWorqhat } from "../../lib/uploadFileToWorqhat"; // ✅ NEW

type CreateGoalFormProps = {
  onAdd: (goal: goals) => void;
  onCancel: () => void;
  goalToEdit?: goals | null;
};

export default function CreateGoalForm({
  onAdd,
  onCancel,
  goalToEdit,
}: CreateGoalFormProps) {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [notes, setNotes] = useState<string>("");
  const [resources, setResources] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [studyMaterial, setStudyMaterial] = useState<File | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setTopic(goalToEdit.topic);
      setStatus(goalToEdit.status as "Beginner" | "Intermediate" | "Advanced");
      setNotes((goalToEdit.notes ?? []).join("\n"));
      setResources((goalToEdit.resources ?? []).join("\n"));
      setTags(goalToEdit.tags?.join(", ") || "");

    } else {
      setTopic("");
      setStatus("Beginner");
      setNotes("");
      setResources("");
      setTags("");
    }
  }, [goalToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedFileUrl = "";

    if (studyMaterial) {
      const url = await uploadFileToWorqhat(studyMaterial);
      if (!url) {
        toast.error("Failed to upload study material");
        return;
      }
      uploadedFileUrl = url;
    }

    const newGoal: goals = {
      topic,
      status,
      notes: notes.split("\n").filter(Boolean),
      resources: resources.split("\n").filter(Boolean),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      studyMaterial: uploadedFileUrl || undefined,
    };

    onAdd(newGoal);

    if (!goalToEdit) {
      setTopic("");
      setStatus("Beginner");
      setNotes("");
      setResources("");
      setTags("");
      setStudyMaterial(null);
      toast.success("Goal added successfully!");
    } else {
      toast.success("Goal updated successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label className="mb-2">Topic</Label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} required />
      </div>

      <div>
        <Label className="mb-2">Status</Label>
        <select
          className="w-full border p-2 rounded-md dark:bg-zinc-800 dark:text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <Label className="mb-2">Notes (one per line)</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      <div>
        <Label className="mb-2">Resources (one per line)</Label>
        <Textarea value={resources} onChange={(e) => setResources(e.target.value)} rows={3} />
      </div>

      <div className="mb-6">
        <Label className="mb-2">Tags (comma-separated)</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div>
        <Label className="mb-2">Study Material (File Upload)</Label>
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg"
          onChange={(e) => setStudyMaterial(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {goalToEdit ? "Update Goal" : "Add Goal"}
        </Button>
      </div>
    </form>
  );
}
