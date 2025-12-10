import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

// Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store tokens: access token in memory, refresh token in localStorage
let accessToken: string | null = null;

// Request interceptor: Attach access token to every request
apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  console.log('[API] Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor: Handle 401 errors by refreshing token
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[API] 401 Unauthorized - Attempting token refresh');
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          console.log('[API] No refresh token - Redirecting to login');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/user/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        accessToken = newAccessToken;
        console.log('[API] ✅ Token refreshed successfully');

        // Update Authorization header for original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('[API] ❌ Token refresh failed - Redirecting to login');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  setAccessToken: (token: string) => {
    accessToken = token;
    console.log('[AUTH] Access token set');
  },

  getAccessToken: () => accessToken,

  setRefreshToken: (token: string) => {
    localStorage.setItem('refresh_token', token);
    console.log('[AUTH] Refresh token stored in localStorage');
  },

  getRefreshToken: () => localStorage.getItem('refresh_token'),

  logout: () => {
    accessToken = null;
    localStorage.removeItem('refresh_token');
    console.log('[AUTH] ✅ Logged out - Tokens cleared');
  },
};

// Export getAccessToken for use in other parts (e.g., useUserProfile hook)
export const getAccessToken = () => accessToken;

export const userApi = {
  register: (email: string, password: string) => {
    console.log('[AUTH] Register attempt:', email);
    return apiClient.post('/user/register', { email, password });
  },

  login: (email: string, password: string) => {
    console.log('[AUTH] Login attempt:', email);
    return apiClient.post('/user/login', { email, password }).then((res) => {
      // Store tokens after successful login
      authApi.setAccessToken(res.data.access_token);
      authApi.setRefreshToken(res.data.refresh_token);
      console.log('[AUTH] ✅ Login successful');
      return res;
    });
  },

  logout: () => {
    authApi.logout();
    return Promise.resolve();
  },

  refresh: (refreshToken: string) =>
    apiClient.post('/user/refresh', { refresh_token: refreshToken }),
};
