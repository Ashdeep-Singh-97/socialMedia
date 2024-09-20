// components/Navbar.tsx
"use client"
// components/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import RGBGlowCard from './RGBGlowCard'; // Ensure correct import path

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation
      setShowAlert(true); // Show the alert
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div>
      <nav className="bg-pink-400 p-4">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Link href="/guest/home" onClick={handleClick} className="text-white hover:text-pink-800">
              Friends
            </Link>
          </li>
          <li>
            <Link href="/guest/about" onClick={handleClick} className="text-white hover:text-pink-800">
              Messages
            </Link>
          </li>
          <li>
            <Link href="/user/profile" onClick={handleClick} className="text-white hover:text-pink-800">
              Profile
            </Link>
          </li>
          <li>
            <Link href="/user/post" onClick={handleClick} className="text-white hover:text-pink-800">
              Post
            </Link>
          </li>
        </ul>
      </nav>

      {/* Conditionally render RGBGlowCard */}
      {showAlert && <RGBGlowCard onClose={handleCloseAlert} />}
    </div>
  );
};

export default Navbar;
