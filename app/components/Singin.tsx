"use client";

import React, { useState } from 'react';
import ErrorCard from '../components/Error';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCustomAction = async () => {
    try {
      const response = await axios.post("/api/user", {
        action: 'signin',
        identifier: email, // Use identifier for both email and username
        password
      });

      const { token, username, email: userEmail, userId } = response.data;

      if (token) {
        if (typeof window !== 'undefined') { // Check for client-side
          localStorage.setItem('authToken', token);
          localStorage.setItem('username', username);
          localStorage.setItem('email', userEmail);
          localStorage.setItem('userId', userId);
        }
        router.push("/user/home");
      } else {
        setError('Token not received');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error during signin';
        setError(errorMessage);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/Globe.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg z-10">
        {error && <ErrorCard message={error} onClose={() => setError(null)} />}
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            onClick={handleCustomAction}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
