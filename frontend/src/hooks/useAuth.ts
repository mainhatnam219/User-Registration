import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/client';

interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Custom hook for login mutation
 * 
 * Usage:
 * const { mutate: login, isPending, isError, error } = useLoginMutation();
 * login({ email: 'user@example.com', password: 'password123' });
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('[LOGIN] Form submitted:', credentials.email);
      console.log('[LOGIN] Form validation passed, sending API request...');
      console.log('[LOGIN] Credentials:', { email: credentials.email });
      return await userApi.login(credentials.email, credentials.password);
    },
    onSuccess: (_data, variables) => {
      console.log('[LOGIN] ✅ Login successful');
      localStorage.setItem('user_email', variables.email);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('[LOGIN] ❌ Login failed:', errorMsg);
    },
  });
};

/**
 * Custom hook for logout mutation
 * 
 * Usage:
 * const { mutate: logout, isPending } = useLogoutMutation();
 * logout();
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('[AUTH] Logging out...');
      return await userApi.logout();
    },
    onSuccess: () => {
      console.log('[AUTH] ✅ Logged out - Tokens cleared');
      localStorage.removeItem('user_email');
      
      // Invalidate all queries to clear cache
      queryClient.invalidateQueries();
      
      // Or specifically invalidate user query:
      // queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      console.error('[AUTH] ❌ Logout failed:', error);
    },
  });
};
