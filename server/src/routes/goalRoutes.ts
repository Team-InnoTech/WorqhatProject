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
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
