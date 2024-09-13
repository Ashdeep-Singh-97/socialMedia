// HomePage.tsx
import React from 'react';
import styles from './page.module.css'; // Import the CSS module

const HomePage: React.FC = () => {
  return (
    <div className={`${styles.background} flex items-center justify-center min-h-screen bg-gray-100`}>
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome</h1>
        <div className="flex flex-col space-y-4">
          <a
            href="/signup"
            className="block text-center text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded transition duration-200"
          >
            Sign Up
          </a>
          <a
            href="/signin"
            className="block text-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition duration-200"
          >
            Sign In
          </a>
          <a
            href="/guest/home"
            className="block text-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition duration-200"
          >
            Join as Guest
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
