import React from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '@/api/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const accessToken = authApi.getAccessToken();

  if (!accessToken) {
    console.log('[ROUTE] No access token - Redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
