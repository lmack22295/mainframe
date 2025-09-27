import { create } from 'zustand';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../../../shared/types';
import { taskService } from '../services/taskService';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskPriority: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.getAllTasks();
      if (response.success && response.data) {
        set({ tasks: response.data, loading: false });
      } else {
        set({ error: response.error || 'Failed to fetch tasks', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  createTask: async (data: CreateTaskRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.createTask(data);
      if (response.success && response.data) {
        const { tasks } = get();
        set({ tasks: [response.data, ...tasks], loading: false });
      } else {
        set({ error: response.error || 'Failed to create task', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to create task', loading: false });
    }
  },

  updateTask: async (id: string, data: UpdateTaskRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.updateTask(id, data);
      if (response.success && response.data) {
        const { tasks } = get();
        const updatedTasks = tasks.map(task =>
          task.id === id ? response.data! : task
        );
        set({ tasks: updatedTasks, loading: false });
      } else {
        set({ error: response.error || 'Failed to update task', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to update task', loading: false });
    }
  },

  deleteTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.deleteTask(id);
      if (response.success) {
        const { tasks } = get();
        const filteredTasks = tasks.filter(task => task.id !== id);
        set({ tasks: filteredTasks, loading: false });
      } else {
        set({ error: response.error || 'Failed to delete task', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to delete task', loading: false });
    }
  },

  toggleTaskPriority: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await taskService.toggleTaskPriority(id);
      if (response.success && response.data) {
        const { tasks } = get();
        const updatedTasks = tasks.map(task =>
          task.id === id ? response.data! : task
        );
        set({ tasks: updatedTasks, loading: false });
      } else {
        set({ error: response.error || 'Failed to toggle task priority', loading: false });
      }
    } catch (error) {
      set({ error: 'Failed to toggle task priority', loading: false });
    }
  },

  clearError: () => set({ error: null })
}));