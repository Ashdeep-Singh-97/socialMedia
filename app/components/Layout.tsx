// components/Layout.tsx
import { ReactNode } from 'react';
import Navbar from './Navbar'; // Ensure the correct path to Navbar component
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode; // Defines the type for children prop
  isLoggedIn: boolean; // Defines the type for authentication status
}

export default function Layout({ children, isLoggedIn }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{background : 'rgba(0,1,0,255)'}}>
      <header>
        <Navbar isLoggedIn={isLoggedIn} /> {/* Pass true/false based on authentication status */}
      </header>
      <main className="flex-1 p-4">
        {children} {/* Render the content passed as children */}
      </main>
      <Footer />
    </div>
  );
}
