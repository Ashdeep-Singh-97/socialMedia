"use client"

import React, { useEffect, useState } from 'react';

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
      <div className="p-8">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-lg">User information is missing. Please log in again.</p>
        <a href="/" className="text-indigo-600 hover:underline">Sign In</a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>
      <p className="text-lg">Your email: {email}</p>
    </div>
  );
};

export default UserHomePage;
