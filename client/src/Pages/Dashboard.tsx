/* eslint-disable @typescript-eslint/no-explicit-any */
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

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { SlidersHorizontal } from "lucide-react";

function Dashboard() {
  const [goals, setGoals] = useState<goals[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<goals | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('recent');

  const [open, setOpen] = useState(false);

  useEffect(() => {
    applyFilters();
  }, []);

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (sort) params.append('sort', sort);

      const response = await fetchGoals(params.toString());
      setGoals(response);
      setOpen(false); // Close the sheet
    } catch (err) {
      console.error('Failed to apply filters:', err);
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

      <div className="flex flex-col md:flex-row">
        {/* Sidebar on Desktop */}
        <aside className="hidden md:block md:w-64 p-4 pt-10 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search by topic..."
              className="border px-3 py-2 rounded-md w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="border px-3 py-2 rounded-md w-full"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              className="border px-3 py-2 rounded-md w-full"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="recent">Recently Added</option>
              <option value="alphabetical">A-Z</option>
            </select>

            <button
              className="bg-black text-white px-4 py-2 rounded-md w-full"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Filters Button for Mobile */}
        <div className="md:hidden px-4 py-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <SlidersHorizontal size={18} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <input
                type="text"
                placeholder="Search by topic..."
                className="border px-3 py-2 rounded-md w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <select
                className="border px-3 py-2 rounded-md w-full"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                className="border px-3 py-2 rounded-md w-full"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="alphabetical">A-Z</option>
              </select>

              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        {/* Goal Cards */}
        <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <div key={(goal as any).documentId || idx} className="min-h-[180px]">
              <GoalCard
                goal={goal}
                onDelete={() => handleDeleteGoal(goal)}
                onEdit={() => handleEditGoal(goal)}
              />
            </div>
          ))}
        </main>
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
    </div>
  );
}

export default Dashboard;
