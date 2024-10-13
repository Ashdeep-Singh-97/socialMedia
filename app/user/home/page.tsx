"use client";

import React, { useEffect, useState } from 'react';
import PostList from '@/app/components/Posts'; // Ensure the path is correct based on your directory structure

const UserHomePage: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // This will run only on the client side
    const storedEmail = localStorage.getItem('email');
    const storedUsername = localStorage.getItem('username');
    setEmail(storedEmail);
    setUsername(storedUsername);
  }, []);

  if (email === null) {
    // Email is not yet loaded or does not exist
    return (
      <div className="p-8 mt-20 text-white">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-lg">User information is missing. Please log in again.</p>
        <a
          href="/signin"
          className="inline-block text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition duration-200"
          style={{ whiteSpace: 'nowrap' }} // Ensures "Sign Up" stays on the same line
        >
          Sign In
        </a>
      </div>
    );
}


  return (
    <div className="p-8 mt-24">
      <h1 className="text-2xl font-bold text-white">Welcome, {username}</h1>
      <p className="text-lg text-white">Your email: {email}</p>
      <PostList userEmail={email} /> {/* Include the PostList component here */}
    </div>
  );
};

export default UserHomePage;
