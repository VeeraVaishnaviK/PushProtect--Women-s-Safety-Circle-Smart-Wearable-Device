import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-warm flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
