"use client";

import React, { useState } from 'react';
import ErrorCard from '../components/Error';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCustomAction = async () => {
    const action = 'signup'; // or 'signin', depending on what you're doing
    try {
      // Make the POST request with action included
      const response = await axios.post("http://localhost:3000/api/user", {
        action,
        email,
        password
      });

      // Extract the token from the response
      const token = response.data; // Since the response is just the token

      if (token) {
        // Store the token in localStorage
        localStorage.setItem('authToken', token);

        // Redirect after successful signup/signin
        router.push("/");
      } else {
        // Handle the case where there is no token in the response
        console.error('Token not received');
      }
    } catch (error) {
      console.error('Error during signup/signin:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };


  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/gradient.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        {error && <ErrorCard message={error} onClose={() => setError(null)} />}
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
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
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div> */}
          <button
            onClick={handleCustomAction}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Have an account?{' '}
          <a href="/signin" className="text-indigo-600 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
