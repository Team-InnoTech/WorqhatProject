import type { goals } from "../../types/goals";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FaStickyNote, FaLink, FaTags, FaEdit, FaTrash } from "react-icons/fa";

type GoalCardProps = {
  goal: goals;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  return (
    <Card className="w-full max-w-100 bg-white border border-gray-300 rounded-xl p-4 m-2 shadow-sm hover:shadow-indigo-300 transition-shadow flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{goal.topic}</h2>
          <div className="flex items-center text-md font-normal text-gray-500 mt-1 gap-2">
            <FaTags className="text-gray-700" />
            {goal.tags?.length ? goal.tags.join(", ") : "No tags"}
          </div>
        </div>

        <span
          className={`text-2xs font-medium p-2 rounded-md shadow-sm ${
            goal.status === "Advanced"
              ? "bg-green-100 text-green-800"
              : goal.status === "Intermediate"
              ? "bg-yellow-100 text-yellow-800 border"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {goal.status}
        </span>
      </div>

      {/* Notes */}
      <div className="mt-4">
        <h3 className="flex items-center gap-2 text-md font-semibold text-orange-600">
          <FaStickyNote className="text-orange-600" />
          Notes
        </h3>
        <ul className="list-disc list-inside text-md text-gray-700 pl-1">
          {goal.notes.length ? (
            goal.notes.map((note, idx) => <li key={idx}>{note}</li>)
          ) : (
            <li>No notes</li>
          )}
        </ul>
      </div>

      {/* Bottom Section: Resources + Actions */}
      <div className="mt-4 flex justify-between items-end">
        {/* Resources */}
        <div>
          <h3 className="flex items-center gap-2 text-md font-semibold text-orange-600 mb-1">
            <FaLink className="text-orange-600" />
            Resources
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 pl-1">
            {goal.resources.length ? (
              goal.resources.map((res, idx) => (
                <li key={idx}>
                  <a
                    href={res}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {res}
                  </a>
                </li>
              ))
            ) : (
              <li>No resources</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <Button
              size="icon"
              variant="outline"
              onClick={onEdit}
              className="border border-blue-400 hover:bg-blue-100"
            >
              <FaEdit className="text-blue-500" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="outline"
              onClick={onDelete}
              className="border border-red-400 hover:bg-red-100"
            >
              <FaTrash className="text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
