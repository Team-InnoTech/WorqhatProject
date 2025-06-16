import { Request, Response } from 'express';
import { worqClient } from '../db/worqdbClient';
import { goals } from '../types/goals';

// GET all goals
export const getAllGoals = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { search, status, sort } = req.query;
    const userId = req.user?.id;

    // Escape single quotes to prevent SQL errors
    const escape = (val: string) => val.replace(/'/g, "''");

    const filters: string[] = [`foreign_key_column = '${escape(userId)}'`];

    if (search) {
      const safeSearch = escape(search as string).toLowerCase();
      filters.push(`LOWER(topic) LIKE '%${safeSearch}%'`);
    }

    if (status) {
      const safeStatus = escape(status as string).toLowerCase();
      filters.push(`LOWER(status) = '${safeStatus}'`);
    }

    let query = `SELECT * FROM goals`;
    if (filters.length > 0) {
      query += ` WHERE ${filters.join(' AND ')}`;
    }

    query += sort === 'recent' ? ` ORDER BY createdAt DESC` : ` ORDER BY topic ASC`;

    console.log('Final SQL query:', query);

    const result = await worqClient(query);
    res.status(200).json({ data: result });
  } catch (error: any) {
    console.error('Error in getAllGoals:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch goals', error: error.message });
  }
};

// POST: create a new goal
export const createGoal = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log("User id is:" +userId);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user info in token' });
      return;
    }

    const { topic, status, notes, resources, tags } = req.body as goals;

    // Step 1: Generate new documentId
    const fetchQuery = "SELECT documentId FROM goals WHERE documentId LIKE 'g%'";
    const fetchResult = await worqClient(fetchQuery);

    const gIds = fetchResult?.data?.map((row: any) => row.documentId) || [];
    const gNums = gIds
      .map((id: string) => parseInt(id.replace('g', ''), 10))
      .filter((num: number) => !isNaN(num));

    const nextNumber = gNums.length > 0 ? Math.max(...gNums) + 1 : 1;
    const newDocumentId = `g${nextNumber}`;

    // Step 2: Escape values
    const escape = (val: any) =>
      typeof val === 'string'
        ? `'${val.replace(/'/g, "''")}'`
        : `'${JSON.stringify(val).replace(/'/g, "''")}'`;

    // Step 3: Insert with userId
    const insertSQL = `
      INSERT INTO goals (documentId, topic, status, notes, resources, tags, foreign_key_column)
      VALUES (
        '${newDocumentId}',
        ${escape(topic)},
        ${escape(status)},
        ${escape(notes || [])},
        ${escape(resources || [])},
        ${escape(tags || [])},
        '${userId}'
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
export const updateGoal = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const { documentId } = req.params;
  const { topic, status, notes, resources, tags } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized: No user in token" });
    return;
  }

  if (!documentId || !topic || !status) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    // Step 1: Verify goal belongs to the user
    // const checkQuery = `SELECT * FROM goals WHERE documentId = '${documentId}' AND foreign_key_column = '${userId}'`;
    // const checkResult = await worqClient(checkQuery);
    // const goalExists = checkResult?.data?.length > 0;

    // if (!goalExists) {
    //   res.status(403).json({ error: "Forbidden: You can only update your own goals" });
    //   return;
    // }

    // Step 2: Escape values
    const safeTopic = topic.replace(/'/g, "''");
    const safeStatus = status.replace(/'/g, "''");
    const safeNotes = JSON.stringify(notes || []);
    const safeResources = JSON.stringify(resources || []);
    const safeTags = JSON.stringify(tags || []);

    // const deleteSQL = `ALTER TABLE goals DELETE WHERE documentId = '${documentId}' AND foreign_key_column = '${userId}'`;

    // const insertSQL = `
    //   INSERT INTO goals (documentId, topic, status, notes, resources, tags, foreign_key_column)
    //   VALUES (
    //     '${documentId}',
    //     '${safeTopic}',
    //     '${safeStatus}',
    //     '${safeNotes}',
    //     '${safeResources}',
    //     '${safeTags}',
    //     '${userId}'
    //   );
    // `;

    const query = `Update goals SET topic = '${safeTopic}', status = '${safeStatus}', notes = '${safeNotes}', resources = '${safeResources}', tags = '${safeTags}' where documentId = '${documentId}' AND foreign_key_column = '${userId}'`;
    // await worqClient(deleteSQL);
    const result = await worqClient(query);

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
export const deleteGoal = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  const { documentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user in token' });
    return;
  }

  try {
    const deleteQuery = `
      ALTER TABLE goals
      DELETE WHERE documentId = '${documentId}' AND foreign_key_column = '${userId}'
    `;
    await worqClient(deleteQuery);

    res.status(200).json({ message: `Goal with ID ${documentId} deleted successfully` });

  } catch (error: any) {
    res.status(500).json({
      message: `Failed to delete goal with ID ${documentId}`,
      error: error.message
    });
  }
};