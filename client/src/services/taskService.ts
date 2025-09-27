import axios from 'axios';
import type { Task, CreateTaskRequest, UpdateTaskRequest, ApiResponse } from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getAllTasks: async (): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await api.get<ApiResponse<Task[]>>('/tasks');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch tasks'
      };
    }
  },

  createTask: async (data: CreateTaskRequest): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.post<ApiResponse<Task>>('/tasks', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create task'
      };
    }
  },

  updateTask: async (id: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update task'
      };
    }
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete task'
      };
    }
  },

  toggleTaskPriority: async (id: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/priority`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to toggle task priority'
      };
    }
  }
};