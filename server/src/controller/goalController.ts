import { Request, Response } from 'express';
import { worqClient } from '../db/worqdbClient';
import { goals } from '../types/Goal';

// GET all goals
export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM Goal`;
    const result = await worqClient(query);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
  }
};

// POST: create a new goal
export const createGoal = async (req: Request, res: Response) => {
  try {
    const { topic, status, notes, resources, tags } = req.body as goals;

    const query = `
      INSERT INTO Goal (topic, status, notes, resources, tags, createdAt)
      VALUES (
        '${topic}',
        '${status}',
        '${JSON.stringify(notes)}',
        '${JSON.stringify(resources)}',
        '${JSON.stringify(tags)}',
        '${new Date().toISOString()}'
      )
    `;

    const result = await worqClient(query);
    res.status(201).json({ message: 'Goal created', result });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

// PUT: update an existing goal
export const updateGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { topic, status, notes, resources, tags } = req.body;

  try {
    const query = `
      UPDATE Goal
      SET topic='${topic}',
          status='${status}',
          notes='${JSON.stringify(notes)}',
          resources='${JSON.stringify(resources)}',
          tags='${JSON.stringify(tags)}'
      WHERE id='${id}'
    `;

    const result = await worqClient(query);
    res.status(200).json({ message: `Goal with ID ${id} updated`, result });
  } catch (error: any) {
    res.status(500).json({ message: `Failed to update goal with ID ${id}`, error: error.message });
  }
};


// DELETE: remove a goal
export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = `DELETE FROM Goal WHERE id='${id}'`;
    await worqClient(query);
    res.status(204).send(); // No Content
  } catch (error: any) {
    res.status(500).json({ message: `Failed to delete goal with ID ${id}`, error: error.message });
  }
};

