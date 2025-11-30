import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input, Button, Alert } from '@/components';
import { userApi } from '@/api/client';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      userApi.register(data.email, data.password),
    onSuccess: (response) => {
      console.log('[SIGNUP] ✅ Register API successful:', response.data);
      setSuccessMessage(
        response.data.message || 'Registration successful! Redirecting to login...'
      );
      setFormData({ email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error: any) => {
      console.error('[SIGNUP] ❌ Register API failed:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      setErrors({ email: errorMessage });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`[SIGNUP] Input changed: ${name} = ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[SIGNUP] Form submitted');
    setSuccessMessage('');

    if (validateForm()) {
      console.log('[SIGNUP] Form validation passed, sending API request...');
      console.log('[SIGNUP] Credentials:', { email: formData.email });
      registerMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log('[SIGNUP] Form validation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600 mb-6">Join us today and get started</p>

          {successMessage && (
            <div className="mb-4">
              <Alert type="success" message={successMessage} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              name="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              name="password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              icon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              name="confirmPassword"
            />

            <Button
              type="submit"
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
            >
              <div className="flex items-center justify-center gap-2">
                Sign Up
                <ArrowRight size={18} />
              </div>
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
