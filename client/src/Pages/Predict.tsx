/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchGoals } from "../services/goalService";
import type { goals } from "../types/goals";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { triggerFlow } from "../lib/uploadFileToWorqhat";

export default function Predict() {
  const [goals, setGoals] = useState<goals[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [predictions, setPredictions] = useState<Record<string, { estimated_days: number; confidence: string; summary: string }>>({});

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await fetchGoals();
        setGoals(data);
      } catch (error) {
        console.error("Error loading goals:", error);
      }
    };
    loadGoals();
  }, []);

  const filteredGoals = goals.filter(goal => {
    return (
      goal.topic.toLowerCase().includes(search.toLowerCase()) &&
      (status ? goal.status === status : true)
    );
  });

  const handleSelect = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGoals([]);
    } else {
      const allIds = filteredGoals.map(goal => (goal as any).documentId);
      setSelectedGoals(allIds);
    }
    setSelectAll(!selectAll);
  };

  const openPredictionModal = async () => {
  if (selectedGoals.length === 0) return;

  const predictionResults: Record<string, any> = {};

  for (const id of selectedGoals) {
    const goal = goals.find(g => (g as any).documentId === id);
    if (!goal) continue;

    try {
      const result = await triggerFlow({
        topic: goal.topic,
        status: goal.status,
        resources: (goal.resources || []).join(", "),
        tags: (goal.tags || []).join(", "),
        hours_spent_perday: goal.hours_spent_perday ,
      });

      predictionResults[id] = result;
    } catch (error) {
      console.error(`Prediction failed for ${goal.topic}:`, error);
    }
  }

  setPredictions(predictionResults);
  setShowModal(true);
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📈 Prediction Table</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <Input
          placeholder="Search by topic..."
          className="max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded-md"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <Button variant="outline" onClick={handleSelectAll}>
          {selectAll ? "Unselect All" : "Select All"}
        </Button>

        <Button onClick={openPredictionModal} disabled={selectedGoals.length === 0}>
          Predict Days
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 border text-left">Select</th>
              <th className="p-3 border text-left">Topic</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Tags</th>
              <th className="p-3 border text-left">Resources</th>
              <th className="p-3 border text-center">Hours/Day</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map((goal, idx) => {
              const hoursPerDay = goal.hours_spent_perday || 0;
              const id = (goal as any).documentId;

              return (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <td className="p-2 border text-center">
                    <Checkbox
                      checked={selectedGoals.includes(id)}
                      onCheckedChange={() => handleSelect(id)}
                    />
                  </td>
                  <td className="p-2 border">{goal.topic}</td>
                  <td className="p-2 border">{goal.status}</td>
                  <td className="p-2 border">
                    {goal.tags?.length ? goal.tags.join(", ") : "—"}
                  </td>
                  <td className="p-2 border text-blue-700 underline">
                    {goal.resources?.length ? (
                      <ul className="list-disc pl-4 space-y-1">
                        {goal.resources.map((link, i) => (
                          <li key={i}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-500"
                            >
                              {link.length > 30 ? link.slice(0, 30) + "..." : link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No resources"
                    )}
                  </td>
                  <td className="p-2 border text-center">{hoursPerDay}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Prediction Preview Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>AI Prediction Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
          {goals
            .filter(goal => selectedGoals.includes((goal as any).documentId))
            .map((goal, idx) => {
              const id = (goal as any).documentId;
              const prediction = predictions[id];

              return (
                <div key={idx} className="border rounded p-3 bg-zinc-100 dark:bg-zinc-900">
                  <p><strong>Topic:</strong> {goal.topic}</p>
                  <p><strong>Status:</strong> {goal.status}</p>
                  <p><strong>Hours/Day:</strong> {goal.hours_spent_perday || "—"}</p>

                  {prediction ? (
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p><strong>Estimated Days:</strong> {prediction.estimated_days}</p>
                      <p><strong>Confidence:</strong> {prediction.confidence}</p>
                      <p><strong>Summary:</strong> {prediction.summary}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-yellow-600">Prediction not available</p>
                  )}
                </div>
              );
            })}
          <p className="text-sm text-gray-500 italic">
            Prediction will be processed by the WorqHat AI workflow...
          </p>
        </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
