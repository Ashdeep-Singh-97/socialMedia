"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import RGBGlowCard from './RGBGlowCard'; // Ensure correct import path

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in by verifying localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      isLoggedIn = false;
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation if not logged in
      setShowAlert(true); // Show the alert
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    // Clear user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    router.push('/'); // Redirect to the home or login page
  };

  return (
    <div>
      <nav
        className={`grid grid-cols-6 w-screen py-5 absolute top-0 left-0 z-30 transition duration-300 border-b-2 border-gray-400
        bg-white/50 backdrop-blur-md shadow-lg`}
      >
        {/* Left part with the logo and "Claude" text */}
        <div className="col-start-2 col-span-2 flex items-center font-stratford">
          <img
            src="/images/chat.svg"
            alt="Claude Icon"
            className="w-16 h-16 mr-2"
          />
          <div className="text-3xl text-black">Chatter G</div>
        </div>

        {/* Right part with the navigation links */}
        <div className="col-start-4 col-span-2 flex justify-end items-center">
          <ul className="flex space-x-8 text-xl">
            <li>
              <Link href="/user/home" onClick={handleClick} className="text-black hover:text-pink-800">
                Home
              </Link>
            </li>
            <li>
              <Link href="/user/friend" onClick={handleClick} className="text-black hover:text-pink-800">
                Friend
              </Link>
            </li>
            <li>
              <Link href="/user/profile" onClick={handleClick} className="text-black hover:text-pink-800">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/user/post" onClick={handleClick} className="text-black hover:text-pink-800">
                Post
              </Link>
            </li>
            <li>
              <Link href="/" onClick={handleLogout} className="text-black hover:text-pink-800">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* RGBGlowCard Alert */}
      {showAlert && <RGBGlowCard onClose={handleCloseAlert} />}
    </div>
  );
};

export default Navbar;
