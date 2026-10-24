import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Bluetooth, Users, Compass, ShieldCheck, Home } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useSafetyStore } from '../store/safetyStore';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { activeIncident } = useSafetyStore();

  const navItems = [
    { path: '/app/dashboard', label: 'Hub', icon: Home },
    { path: '/app/device', label: 'Wearable', icon: Bluetooth },
    { path: '/app/contacts', label: 'Circle', icon: Users },
    { path: '/app/journey', label: 'Journey', icon: Compass },
    { path: '/app/practice', label: 'Practice', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-ivory-warm flex flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar (Thumb-friendly PWA) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-subtle px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-plum font-bold' : 'text-text-secondary hover:text-plum'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-plum scale-110' : 'text-text-secondary'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
