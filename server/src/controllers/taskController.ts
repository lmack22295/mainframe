import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, notes, priority } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        notes,
        priority: priority || false
      }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    } else {
      next(error);
    }
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      data: { message: 'Task deleted successfully' }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    } else {
      next(error);
    }
  }
};

export const toggleTaskPriority = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const currentTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!currentTask) {
      res.status(404).json({
        success: false,
        error: 'Task not found'
      });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        priority: !currentTask.priority
      }
    });

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};