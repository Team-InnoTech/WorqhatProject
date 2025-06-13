import { Request, Response } from 'express';
import { worqClient } from '../db/worqdbClient';
import { goals } from '../types/goals';

// GET all goals
export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM goals`;
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
      INSERT INTO goals (topic, status, notes, resources, tags)
      VALUES (
        '${topic}',
        '${status}',
        '${JSON.stringify(notes)}',
        '${JSON.stringify(resources)}',
        '${JSON.stringify(tags)}'
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
  const { documentId } = req.params;
  const { topic, status, notes, resources, tags } = req.body;

  if (!documentId || !topic || !status) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const safeTopic = topic.replace(/'/g, "''");
  const safeStatus = status.replace(/'/g, "''");
  const safeNotes = JSON.stringify(notes || []);
  const safeResources = JSON.stringify(resources || []);
  const safeTags = JSON.stringify(tags || []);

  const deleteSQL = `ALTER TABLE goals DELETE WHERE documentId = '${documentId}'`;

  const insertSQL = `
    INSERT INTO goals (documentId, topic, status, notes, resources, tags)
    VALUES (
      '${documentId}',
      '${safeTopic}',
      '${safeStatus}',
      '${safeNotes}',
      '${safeResources}',
      '${safeTags}'
    );
  `;

  try {
    await worqClient(deleteSQL);
    const result = await worqClient(insertSQL);
    res.status(200).json({ message: `Goal with ID ${documentId} updated`, result });
  } catch (error: any) {
    console.error("Update error:", error);
    res.status(500).json({
      message: `Failed to update goal with ID ${documentId}`,
      error: error.message,
      stack: error.stack,
    });
  }
};


// DELETE: remove a goal
export const deleteGoal = async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const query = `ALTER TABLE goals
    DELETE WHERE documentId = '${documentId}'`;
    await worqClient(query);
    res.status(200).json({ message: `Goal with ID ${documentId} deleted successfully` }); 
  } catch (error: any) {
    res.status(500).json({ message: `Failed to delete goal with ID ${documentId}`, error: error.message });
  }
};

