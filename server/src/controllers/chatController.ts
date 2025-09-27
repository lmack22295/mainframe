import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllChatSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await prisma.chatSession.findMany({
      include: {
        _count: {
          select: { messages: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

export const createChatSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const session = await prisma.chatSession.create({
      data: { name }
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

export const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content, role } = req.body;

    const session = await prisma.chatSession.findUnique({
      where: { id }
    });

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
      return;
    }

    const message = await prisma.chatMessage.create({
      data: {
        content,
        role,
        sessionId: id
      }
    });

    await prisma.chatSession.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChatSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.chatSession.delete({
      where: { id }
    });

    res.json({
      success: true,
      data: { message: 'Chat session deleted successfully' }
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    } else {
      next(error);
    }
  }
};

export const clearChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const session = await prisma.chatSession.findUnique({
      where: { id }
    });

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
      return;
    }

    await prisma.chatMessage.deleteMany({
      where: { sessionId: id }
    });

    res.json({
      success: true,
      data: { message: 'Chat history cleared successfully' }
    });
  } catch (error) {
    next(error);
  }
};