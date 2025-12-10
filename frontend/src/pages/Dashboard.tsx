import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/client';
import { useUserProfile, useLogoutMutation } from '@/hooks';
import { Button } from '@/components';
import { LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  const accessToken = authApi.getAccessToken();

  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useUserProfile();
  
  const logoutMutation = useLogoutMutation();

  // Redirect to login if no token
  useEffect(() => {
    if (!accessToken) {
      console.log('[DASHBOARD] No access token, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [accessToken, navigate]);

  const handleLogout = () => {
    console.log('[DASHBOARD] Logout clicked');
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('[DASHBOARD] Logout successful, redirecting to login');
        navigate('/login', { replace: true });
      }
    });
  };

  const email = user?.email || localStorage.getItem('user_email') || 'User';

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isErrorUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading profile</p>
          <Button onClick={() => navigate('/login')}>Back to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {email.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
            <p className="text-gray-600 mt-2">You are logged in</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-lg font-semibold text-gray-800 break-all">{email}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-sm text-blue-700">
              ✅ <strong>Access Token:</strong> Active
            </p>
            <p className="text-xs text-blue-600 mt-2 font-mono break-all">
              {accessToken?.substring(0, 20)}...
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>🔒 Your session is protected with JWT authentication</p>
            <p>⏰ Access token expires in 15 minutes</p>
            <p>🔄 Automatically refreshes when expired</p>
          </div>

          <Button
            onClick={handleLogout}
            loading={logoutMutation.isPending}
            disabled={logoutMutation.isPending}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut size={18} />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </div>
          </Button>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Your tokens are securely managed with automatic refresh
          </p>
        </div>
      </div>
    </div>
  );
};
