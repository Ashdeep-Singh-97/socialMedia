// /src/app/user/home/page.tsx
"use client"

import PostList from '@/app/components/Posts';
import React from 'react';

const UserHomePage: React.FC = () => {
  
  return (
    <div className="p-8 mt-20">
      <h1 className="text-2xl font-bold text-white">Welcome Guest</h1>
      <PostList userEmail={null} />
    </div>
  );
};

export default UserHomePage;
