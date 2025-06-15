import { Request, Response } from 'express';
import { worqClient } from '../db/worqdbClient';
import { goals } from '../types/goals';

// GET all goals
export const getAllGoals = async (req: Request, res: Response) => {
  try {
    const { search, status, sort } = req.query; 

    let query = `SELECT * FROM goals`;
    const filters: string[] = [];

    if (search) filters.push(`LOWER(topic) LIKE '%${(search as string).toLowerCase()}%'`);
    if (status) filters.push(`LOWER(status) = '${(status as string).toLowerCase()}'`);

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(' AND ')}`;
    }
    query += sort === 'recent' ? ` ORDER BY createdAt DESC` : ` ORDER BY topic ASC`;


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

    // Step 1: Fetch existing g-based documentIds
    const fetchQuery = "SELECT documentId FROM goals WHERE documentId LIKE 'g%'";
    const fetchResult = await worqClient(fetchQuery);

    const gIds = fetchResult?.data?.map((row: any) => row.documentId) || [];
    const gNums = gIds
      .map((id: string) => parseInt(id.replace('g', ''), 10))
      .filter((num: number) => !isNaN(num));

    const nextNumber = gNums.length > 0 ? Math.max(...gNums) + 1 : 1;
    const newDocumentId = `g${nextNumber}`;

    // Manually escape string values
    const escape = (val: any) =>
      typeof val === 'string'
        ? `'${val.replace(/'/g, "''")}'`
        : `'${JSON.stringify(val).replace(/'/g, "''")}'`;

    // Step 2: Create INSERT SQL
    const insertSQL = `
      INSERT INTO goals (documentId, topic, status, notes, resources, tags)
      VALUES (
        '${newDocumentId}',
        ${escape(topic)},
        ${escape(status)},
        ${escape(notes || [])},
        ${escape(resources || [])},
        ${escape(tags || [])}
      )
    `;

    const insertResult = await worqClient(insertSQL);

    res.status(201).json({
      message: 'Goal created successfully',
      documentId: newDocumentId,
      result: insertResult
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create goal', error: error.message });
  }
};

// PUT: update an existing goal
export const updateGoal = async (req: Request, res: Response): Promise<void> => {
  const { documentId } = req.params;
  const { topic, status, notes, resources, tags } = req.body;

  if (!documentId || !topic || !status) {
    res.status(400).json({ error: "Missing required fields." });
    return;
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