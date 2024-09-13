// /src/app/user/home/page.tsx

import React from 'react';

const UserHomePage: React.FC = () => {
 
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, Guest</h1>
      <p className="text-lg"> Please login to make the most of it.</p><a href="/" className="text-indigo-600 hover:underline">Sign In</a>
    </div>
  );
};

export default UserHomePage;
