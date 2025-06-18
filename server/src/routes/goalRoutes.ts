import express from 'express';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controller/goalController';
import { verifyToken } from '../middleware/authmiddleware';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', verifyToken, getAllGoals);
router.post('/', verifyToken, upload.single('file'), createGoal);
router.put('/:documentId', verifyToken, updateGoal);
router.delete('/:documentId', verifyToken, deleteGoal);

export default router;
