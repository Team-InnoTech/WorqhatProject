import { useState } from 'react'
import Header from '../components/page_comp/Header'
import GoalCard from '../components/page_comp/GoalCard'
import CreateGoalForm from '../components/page_comp/CreateGoalForm'
import type { Goal } from '../types/goal'
import { RxCross2 } from "react-icons/rx"
import {toast} from "sonner"

function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      topic: "Learn TypeScript",
      status: "Intermediate",
      notes: ["Understand types", "Practice utility types"],
      resources: ["https://www.typescriptlang.org/docs", "https://tsplay.dev"],
      tags: ["typescript", "frontend", "practice"],
    },
    {
      topic: "Master React",
      status: "Advanced",
      notes: ["Learn hooks", "Understand context API", "Build projects"],
      resources: [
        "https://reactjs.org/docs/getting-started.html",
        "https://react.dev/learn",
      ],
      tags: ["react", "frontend", "projects"],
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)

  const handleAddClick = () => {
    setEditingGoal(null) // clear any previous goal
    setShowForm(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal) // load goal into form
    setShowForm(true)
  }

  const handleSaveGoal = (goal: Goal) => {
    if (editingGoal) {
      setGoals(prev =>
        prev.map(g => (g.topic === editingGoal.topic ? goal : g))
      )
    } else {
      setGoals(prev => [...prev, goal])
    }
    setShowForm(false)
    setEditingGoal(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingGoal(null)
  }

  const handleDeleteGoal = (index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index))
    toast.success("Deleted successfully!");
  }

  return (
    <div className="relative">
      <Header onAddClick={handleAddClick} />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative bg-white dark:bg-zinc-900 p-10 rounded-md border w-full max-w-xl mx-4">
            <button
              onClick={handleCancelForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              <RxCross2 size={20} />
            </button>

            <CreateGoalForm
              onAdd={handleSaveGoal}
              onCancel={handleCancelForm}
              goalToEdit={editingGoal}
            />
          </div>
        </div>
      )}

      <main className="flex flex-wrap gap-4 p-4">
        {goals.map((goal, idx) => (
          <GoalCard
            key={idx}
            goal={goal}
            onDelete={() => handleDeleteGoal(idx)}
            onEdit={() => handleEditGoal(goal)}
          />
        ))}
      </main>
    </div>
  )
}

export default Dashboard
