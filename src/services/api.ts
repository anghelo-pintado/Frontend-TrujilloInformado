import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('API response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API error:', error.config?.url, error.response?.status, error.message);

    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Error de conexión con el backend. ¿Está corriendo en el puerto correcto?');
    }

    return Promise.reject(error);
  }
);

export const testConnection = async () => {
  try {
    const response = await apiClient.get('/reportes');
    return response.status === 200;
  }
  catch (error) {
    console.error('Error testing connection:', error);
    return false;
  }
};

export const devRequest = {
  get: (url) => apiClient.get(url),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
}