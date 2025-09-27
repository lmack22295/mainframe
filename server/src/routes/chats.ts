import express from 'express';
import {
  getAllChatSessions,
  createChatSession,
  getChatMessages,
  sendMessage,
  deleteChatSession,
  clearChatHistory
} from '../controllers/chatController';
import { validateBody, validateParams } from '../middleware/validation';
import { CreateChatSessionSchema, SendMessageSchema, IdParamSchema } from '../types/schemas';

const router = express.Router();

router.get('/', getAllChatSessions);
router.post('/', validateBody(CreateChatSessionSchema), createChatSession);
router.get('/:id/messages', validateParams(IdParamSchema), getChatMessages);
router.post('/:id/messages', validateParams(IdParamSchema), validateBody(SendMessageSchema), sendMessage);
router.delete('/:id', validateParams(IdParamSchema), deleteChatSession);
router.post('/:id/clear', validateParams(IdParamSchema), clearChatHistory);

export default router;