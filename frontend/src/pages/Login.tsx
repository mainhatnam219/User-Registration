import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input, Button, Alert } from '@/components';
import { userApi } from '@/api/client';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`[LOGIN] Input changed: ${name} = ${value}`);
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
    console.log('[LOGIN] Form submitted');
    setSuccessMessage('');
    setErrorMessage('');

    if (validateForm()) {
      console.log('[LOGIN] Form validation passed, sending API request...');
      console.log('[LOGIN] Credentials:', { email: formData.email });
      setIsLoading(true);
      userApi
        .login(formData.email, formData.password)
        .then(() => {
          console.log('[LOGIN] ✅ Login API successful');
          setSuccessMessage('Login successful! Welcome back.');
          setFormData({ email: '', password: '' });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('[LOGIN] ❌ Login API failed:', error.response?.data || error.message);
          const errorMsg =
            error.response?.data?.message || 'Login failed. Please try again.';
          setErrorMessage(errorMsg);
          setIsLoading(false);
        });
    } else {
      console.log('[LOGIN] Form validation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-6">Sign in to your account</p>

          {successMessage && (
            <div className="mb-4">
              <Alert type="success" message={successMessage} />
            </div>
          )}

          {errorMessage && (
            <div className="mb-4">
              <Alert type="error" message={errorMessage} />
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
              placeholder="Enter your password"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              name="password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">
                Forgot password?
              </a>
            </div>

            <Button type="submit" loading={isLoading} disabled={isLoading}>
              <div className="flex items-center justify-center gap-2">
                Sign In
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
        </div>
      </div>
    </div>
  );
};
