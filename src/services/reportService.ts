import { apiClient } from './api';
import { Report } from '../types';

export const reportService = {
  getReports: async () => {
    const response = await apiClient.get('/reportes');
    console.log('Raw API response:', response.data);
    
    // Si los datos vienen en un objeto con una propiedad específica, accede a ella
    // Ejemplo: { reportes: [...] } o { data: [...] }
    if (response.data && Array.isArray(response.data.reportes)) {
      return response.data.reportes;
    }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Si no es un array, devolver array vacío para evitar errores
    console.warn('API response is not an array, returning empty array:', response.data);
    return [];
  },

  createReport: async (reportData: Partial<Report>) => {
    console.log('Create report request:', reportData);
    console.log('user:', reportData.citizenId);
    const response = await apiClient.post('/reporte', reportData);
    console.log('Create report response:', response.data);
    
    // Manejar la respuesta de creación
    if (response.data && response.data.reporte) {
      return response.data.reporte;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  updateReport: async (id: string, reportData: Partial<Report>) => {
    const response = await apiClient.put(`/reporte/${id}`, reportData);
    console.log('Update report response:', response.data);
    
    // Manejar la respuesta de actualización
    if (response.data && response.data.reporte) {
      return response.data.reporte;
    }
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  deleteReport: async (id: string) => {
    await apiClient.delete(`/reporte/${id}`);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/reporte/cargar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Upload image response:', response.data);
    return response.data;
  }
};