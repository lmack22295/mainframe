import { create } from 'zustand';
import type { ChatSession, ChatMessage, CreateChatSessionRequest } from '../../../shared/types';
import { MessageRole } from '../../../shared/types';
import { chatService } from '../services/chatService';

interface ChatStore {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;

  fetchSessions: () => Promise<void>;
  createSession: (data: CreateChatSessionRequest) => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearHistory: (sessionId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  error: null,

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await chatService.getAllSessions();
      if (response.success && response.data) {
        set({ sessions: response.data, loading: false });
      } else {
        set({ error: response.error || 'Failed to fetch sessions', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch sessions', loading: false });
    }
  },

  createSession: async (data: CreateChatSessionRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await chatService.createSession(data);
      if (response.success && response.data) {
        const { sessions } = get();
        set({
          sessions: [response.data, ...sessions],
          currentSession: response.data,
          messages: [],
          loading: false
        });
      } else {
        set({ error: response.error || 'Failed to create session', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to create session', loading: false });
    }
  },

  selectSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const { sessions } = get();
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const response = await chatService.getMessages(sessionId);
        if (response.success && response.data) {
          set({
            currentSession: session,
            messages: response.data,
            loading: false
          });
        } else {
          set({ error: response.error || 'Failed to load messages', loading: false });
        }
      }
    } catch (error) {
      set({ error: 'Failed to load session', loading: false });
    }
  },

  sendMessage: async (content: string) => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ loading: true, error: null });
    try {
      const userMessageResponse = await chatService.sendMessage(currentSession.id, {
        content,
        role: MessageRole.USER
      });

      if (userMessageResponse.success && userMessageResponse.data) {
        const { messages } = get();
        set({ messages: [...messages, userMessageResponse.data] });

        const assistantResponse = await chatService.sendToLLM({
          message: content,
          sessionId: currentSession.id,
          provider: 'claude'
        });

        if (assistantResponse.success && assistantResponse.data) {
          const assistantMessageResponse = await chatService.sendMessage(currentSession.id, {
            content: assistantResponse.data.response,
            role: MessageRole.ASSISTANT
          });

          if (assistantMessageResponse.success && assistantMessageResponse.data) {
            const { messages: currentMessages } = get();
            set({
              messages: [...currentMessages, assistantMessageResponse.data],
              loading: false
            });
          }
        }
      } else {
        set({ error: userMessageResponse.error || 'Failed to send message', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to send message', loading: false });
    }
  },

  deleteSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await chatService.deleteSession(sessionId);
      if (response.success) {
        const { sessions, currentSession } = get();
        const filteredSessions = sessions.filter(s => s.id !== sessionId);
        set({
          sessions: filteredSessions,
          currentSession: currentSession?.id === sessionId ? null : currentSession,
          messages: currentSession?.id === sessionId ? [] : get().messages,
          loading: false
        });
      } else {
        set({ error: response.error || 'Failed to delete session', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to delete session', loading: false });
    }
  },

  clearHistory: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await chatService.clearHistory(sessionId);
      if (response.success) {
        const { currentSession } = get();
        if (currentSession?.id === sessionId) {
          set({ messages: [], loading: false });
        } else {
          set({ loading: false });
        }
      } else {
        set({ error: response.error || 'Failed to clear history', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to clear history', loading: false });
    }
  },

  clearError: () => set({ error: null })
}));