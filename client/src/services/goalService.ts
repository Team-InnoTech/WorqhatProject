// goalService.ts
import axios from 'axios';
import type { goals } from '../types/goals';

const API_BASE = 'http://localhost:5000/api/goals';

// Utility to get headers with Authorization token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};

export const fetchGoals = async (queryParams: string = '') => {
  const url = queryParams ? `${API_BASE}?${queryParams}` : API_BASE;
  const res = await axios.get(url, getAuthHeaders());
  const rawGoals = res.data.data.data;
  console.log("response", res.data);

  const safeParseArray = (input: any): string[] => {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed;
        return input.split(',').map((s) => s.trim());
      } catch {
        return input.split(',').map((s) => s.trim());
      }
    }
    return [];
  };

  const parsedGoals = rawGoals.map((goal: any) => ({
    ...goal,
    tags: safeParseArray(goal.tags),
    notes: safeParseArray(goal.notes),
    resources: safeParseArray(goal.resources),
  }));

  return parsedGoals;
};

export const createGoal = async (goal: goals) => {
  return await axios.post(API_BASE, goal, getAuthHeaders());
};

export const updateGoal = async (documentId: string, goal: goals) => {
  return await axios.put(`${API_BASE}/${documentId}`, goal, getAuthHeaders());
};

export const deleteGoal = async (documentId: string) => {
  return await axios.delete(`${API_BASE}/${documentId}`, getAuthHeaders());
};
