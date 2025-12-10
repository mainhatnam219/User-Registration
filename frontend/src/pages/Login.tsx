import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Alert } from '@/components';
import { userApi } from '@/api/client';

interface LoginFormInputs {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // useMutation for login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      console.log('[LOGIN] Form submitted:', data.email);
      console.log('[LOGIN] Form validation passed, sending API request...');
      console.log('[LOGIN] Credentials:', { email: data.email });
      return await userApi.login(data.email, data.password);
    },
    onSuccess: (_data, variables) => {
      console.log('[LOGIN] ✅ Login successful');
      localStorage.setItem('user_email', variables.email);
      reset();
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('[LOGIN] ❌ Login failed:', errorMsg);
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-6">Sign in to your account</p>

          {loginMutation.isSuccess && (
            <div className="mb-4">
              <Alert type="success" message="Login successful! Redirecting..." />
            </div>
          )}

          {loginMutation.isError && (
            <div className="mb-4">
              <Alert 
                type="error" 
                message={loginMutation.error?.response?.data?.message || 'Login failed. Please try again.'} 
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={loginMutation.isPending} disabled={loginMutation.isPending}>
              <div className="flex items-center justify-center gap-2">
                {loginMutation.isPending ? 'Logging in...' : 'Sign In'}
                <ArrowRight size={18} />
              </div>
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p className="font-semibold mb-1">🔐 JWT Authentication Enabled</p>
            <p>Access token + refresh token for secure sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
