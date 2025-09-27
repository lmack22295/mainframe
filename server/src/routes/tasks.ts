import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskPriority
} from '../controllers/taskController';
import { validateBody, validateParams } from '../middleware/validation';
import { CreateTaskSchema, UpdateTaskSchema, IdParamSchema } from '../types/schemas';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', validateBody(CreateTaskSchema), createTask);
router.put('/:id', validateParams(IdParamSchema), validateBody(UpdateTaskSchema), updateTask);
router.delete('/:id', validateParams(IdParamSchema), deleteTask);
router.patch('/:id/priority', validateParams(IdParamSchema), toggleTaskPriority);

export default router;