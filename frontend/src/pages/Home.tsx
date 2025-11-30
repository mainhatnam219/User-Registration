import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Welcome to Auth Hub</h1>
        <p className="text-xl mb-8 opacity-90">
          Your secure user registration and authentication platform
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition border-2 border-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
