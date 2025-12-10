import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { getAccessToken } from '@/api/client';
import { useEffect } from 'react';

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
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();

  // Disable query if no token
  const query = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      console.log('[API] Fetching user profile...');
      const response = await apiClient.get('/user/profile');
      console.log('[API] User profile loaded:', response.data);
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Clear query when token is removed
  useEffect(() => {
    if (!accessToken && query.data) {
      console.log('[API] Token removed, clearing user profile cache');
      queryClient.removeQueries({ queryKey: ['user'] });
    }
  }, [accessToken, query.data, queryClient]);

  return query;
};
