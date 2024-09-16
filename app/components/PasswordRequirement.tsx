// components/PasswordRequirements.tsx
import React from 'react';

const PasswordRequirements: React.FC = () => {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg text-sm text-gray-700 p-2">
      <p>Password must be at least 6 characters long.</p>
    </div>
  );
};

export default PasswordRequirements;
