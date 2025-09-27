import axios from 'axios';
import type {
  ChatSession,
  ChatMessage,
  CreateChatSessionRequest,
  SendMessageRequest,
  LLMChatRequest,
  ApiResponse
} from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  getAllSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    try {
      const response = await api.get<ApiResponse<ChatSession[]>>('/chats');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch chat sessions'
      };
    }
  },

  createSession: async (data: CreateChatSessionRequest): Promise<ApiResponse<ChatSession>> => {
    try {
      const response = await api.post<ApiResponse<ChatSession>>('/chats', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create chat session'
      };
    }
  },

  getMessages: async (sessionId: string): Promise<ApiResponse<ChatMessage[]>> => {
    try {
      const response = await api.get<ApiResponse<ChatMessage[]>>(`/chats/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch messages'
      };
    }
  },

  sendMessage: async (sessionId: string, data: SendMessageRequest): Promise<ApiResponse<ChatMessage>> => {
    try {
      const response = await api.post<ApiResponse<ChatMessage>>(`/chats/${sessionId}/messages`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send message'
      };
    }
  },

  deleteSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/chats/${sessionId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete session'
      };
    }
  },

  clearHistory: async (sessionId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post<ApiResponse<void>>(`/chats/${sessionId}/clear`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to clear history'
      };
    }
  },

  sendToLLM: async (data: LLMChatRequest): Promise<ApiResponse<{ response: string; provider: string; sessionId: string }>> => {
    try {
      const response = await api.post<ApiResponse<{ response: string; provider: string; sessionId: string }>>('/llm/chat', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get LLM response'
      };
    }
  }
};