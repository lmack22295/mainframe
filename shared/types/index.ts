export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const MessageRole = {
  USER: 'USER',
  ASSISTANT: 'ASSISTANT'
} as const;

export type MessageRole = typeof MessageRole[keyof typeof MessageRole];

export interface Task {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  status: TaskStatus;
  priority: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSession {
  id: string;
  name: string;
  messages?: ChatMessage[];
  contextFiles?: ContextFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  sessionId: string;
  createdAt: Date;
}

export interface ContextFile {
  id: string;
  filename: string;
  filepath: string;
  sessionId: string;
  uploadedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  notes?: string;
  priority?: boolean;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  notes?: string;
  status?: TaskStatus;
  priority?: boolean;
}

export interface CreateChatSessionRequest {
  name: string;
}

export interface SendMessageRequest {
  content: string;
  role: MessageRole;
}

export interface LLMChatRequest {
  message: string;
  sessionId: string;
  provider: 'claude' | 'openai';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}