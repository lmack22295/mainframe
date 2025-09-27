import { z } from 'zod';

export const TaskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const MessageRoleSchema = z.enum(['USER', 'ASSISTANT']);

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  notes: z.string().optional(),
  priority: z.boolean().optional().default(false)
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  status: TaskStatusSchema.optional(),
  priority: z.boolean().optional()
});

export const CreateChatSessionSchema = z.object({
  name: z.string().min(1).max(255)
});

export const SendMessageSchema = z.object({
  content: z.string().min(1),
  role: MessageRoleSchema
});

export const LLMChatSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string(),
  provider: z.enum(['claude', 'openai'])
});

export const IdParamSchema = z.object({
  id: z.string()
});