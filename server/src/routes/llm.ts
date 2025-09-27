import express from 'express';
import { validateBody } from '../middleware/validation';
import { LLMChatSchema } from '../types/schemas';
import { llmLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/chat', llmLimiter, validateBody(LLMChatSchema), async (req, res, next) => {
  try {
    const { message, sessionId, provider } = req.body;

    if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'No LLM API keys configured'
      });
    }

    res.json({
      success: true,
      data: {
        response: `This is a placeholder response for: ${message}. LLM integration will be implemented in the UI phase.`,
        provider,
        sessionId
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;