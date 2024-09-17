// components/Layout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar'; // Ensure the correct path to Navbar component
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode; // Defines the type for children prop
  isLoggedIn: boolean; // Defines the type for authentication status
}

export default function Layout({ children, isLoggedIn }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar isLoggedIn={isLoggedIn} /> {/* Pass true/false based on authentication status */}
      </header>
      <main className="flex-1 p-4">
        {children} {/* Render the content passed as children */}
      </main>
      <footer className="bg-pink-400 text-white p-4 text-center">
        <Link href="/guest/home" className="bg-pink-400 hover:text-pink-800 p-4 m-4">
          Footer
        </Link>
      </footer>
    </div>
  );
}
