import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { getAccessToken } from '@/api/client';

interface UserProfile {
  id: string;
  email: string;
  createdAt?: string;
}

/**
 * Custom hook for fetching user profile
 * 
 * Usage:
 * const { data: user, isLoading, isError, error } = useUserProfile();
 * 
 * Note: This hook will only fetch if user is authenticated (has access token)
 */
export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      console.log('[API] Fetching user profile...');
      const response = await apiClient.get('/user/profile');
      console.log('[API] User profile loaded:', response.data);
      return response.data;
    },
    enabled: !!getAccessToken(), 
    staleTime: 5 * 60 * 1000, 
    retry: 1,
  });
};
