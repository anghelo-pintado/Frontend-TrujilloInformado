import { apiClient } from './api';
import { Task } from '../types';

export const taskService = {
  getTasks: async () => {
    const response = await apiClient.get('/tareas');
    if (response.data && Array.isArray(response.data.tareas)) {
      return response.data.tareas;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  createTask: async (taskData: Partial<Task>) => {
    const response = await apiClient.post('/tarea', taskData);
    if (response.data && response.data.tarea) {
      return response.data.tarea;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await apiClient.put(`/tarea/${id}`, taskData);
    if (response.data && response.data.tarea) {
      return response.data.tarea;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  deleteTask: async (id: string) => {
    await apiClient.delete(`/tarea/${id}`);
  },
};
