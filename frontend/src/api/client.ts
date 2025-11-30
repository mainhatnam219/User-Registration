import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  register: (email: string, password: string) =>
    apiClient.post('/user/register', { email, password }),
  login: (email: string, password: string) =>
    apiClient.post('/user/login', { email, password }),
};
