import express from 'express';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controller/goalController';

const router = express.Router();
router.get('/', getAllGoals);
router.post('/', createGoal);
router.put('/:documentId', updateGoal);
router.delete('/:documentId', deleteGoal);

export default router;
