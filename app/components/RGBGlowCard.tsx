// components/RGBGlowCard.tsx
import { useRef } from 'react';

interface RGBGlowCardProps {
  onClose: () => void; // Function to handle closing the card
}

const RGBGlowCard = ({ onClose }: RGBGlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      onClose(); // Close the card when clicking outside
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={cardRef}
        className="relative p-1 bg-transparent rounded-lg"
      >
        {/* Outer RGB Border */}
        <div className="absolute inset-0 -m-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg opacity-50 blur-md"></div>
        <div className="relative bg-white text-black shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-lg mt-2">
            Please log in to access this page.
          </p>
          <a href="/" className="block text-indigo-600 hover:underline mt-4">
            Go to Login
          </a>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RGBGlowCard;
