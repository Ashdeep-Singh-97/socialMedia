import React, { useState } from 'react';
import ErrorCard from '../components/Error';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PasswordRequirements from '../components/PasswordRequirement'; // Adjust path as needed

const SignUpForm: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState<boolean>(false);
  const router = useRouter();

  const handleCustomAction = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post("/api/user", {
        action: 'signup',
        username,
        email,
        password
      });

      const { token, userId } = response.data;

      if (token) {
        if (typeof window !== 'undefined') { // Check for client-side
          localStorage.setItem('authToken', token);
          localStorage.setItem('email', email);
          localStorage.setItem('username', username);
          localStorage.setItem('userId', userId);
        }
        router.push("/user/home");
      } else {
        setError('Token not received');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error during signup';
        console.log(error);
        setError(errorMessage);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
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
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg z-20">
        {error && <ErrorCard message={error} onClose={() => setError(null)} />}
        <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowRequirements(true)}
              onBlur={() => setShowRequirements(false)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {showRequirements && <PasswordRequirements />}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
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
