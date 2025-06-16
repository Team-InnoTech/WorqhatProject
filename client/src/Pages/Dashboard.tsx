/* eslint-disable @typescript-eslint/no-explicit-any */
// Dashboard.tsx
import { useEffect, useState, useCallback } from 'react';
import Header from '../components/page_comp/Header';
import GoalCard from '../components/page_comp/GoalCard';
import CreateGoalForm from '../components/page_comp/CreateGoalForm';
import type { goals } from '../types/goals';
import { RxCross2 } from 'react-icons/rx';
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../services/goalService';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import debounce from "lodash.debounce";

function Dashboard() {
  const [goals, setGoals] = useState<goals[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<goals | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    applyFilters();
  }, []);

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (sort) params.append("sort", sort);

      const response = await fetchGoals(params.toString());
      setGoals(response);
    } catch (err) {
      console.error("Failed to apply filters:", err);
    }
  };

  const debouncedFilter = useCallback(
    debounce(() => {
    applyFilters();
    }, 500),
    [search, status, sort]
    );

    useEffect(() => {
    debouncedFilter();
    return debouncedFilter.cancel;
  }, [search, status, sort]);

  const handleAddClick = () => {
    setEditingGoal(null);
    setShowForm(true);
  };

  const handleEditGoal = (goal: goals) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleSaveGoal = async (goal: goals) => {
    try {
      if (editingGoal && (editingGoal as any).documentId) {
        await updateGoal((editingGoal as any).documentId, goal);
        setGoals(prev =>
          prev.map(g => ((g as any).documentId === (editingGoal as any).documentId ? goal : g))
        );
      } else {
        const newGoal = { ...goal, documentId: uuidv4() };
        await createGoal(newGoal);
        setGoals(prev => [...prev, newGoal]);
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = async (goal: goals) => {
    try {
      await deleteGoal((goal as any).documentId);
      setGoals(prev => prev.filter(g => (g as any).documentId !== (goal as any).documentId));
      toast.success('Deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="relative">
      <Header onAddClick={handleAddClick} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-2">
        <input
          type="text"
          placeholder="Search by topic..."
          className="border px-3 py-2 rounded-md w-full sm:w-60"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-md w-full sm:w-40"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full sm:w-40"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="alphabetical">A-Z</option>
        </select>

        <button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Form Modal */}
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

      {/* Goal List */}
      <main className="flex flex-wrap gap-4 p-4">
        {goals.map((goal, idx) => (
          <GoalCard
            key={(goal as any).documentId || idx}
            goal={goal}
            onDelete={() => handleDeleteGoal(goal)}
            onEdit={() => handleEditGoal(goal)}
          />
        ))}
      </main>
    </div>
  );
}

export default Dashboard;