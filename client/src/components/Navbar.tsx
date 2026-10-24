import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Radio, Users, Compass, Bell, AlertTriangle, Bluetooth, Smartphone } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const { device, activeIncident } = useSafetyStore();

  const isDeviceConnected = device?.pairingStatus === 'connected';

  return (
    <header className="sticky top-0 z-50 bg-[#FFFAF6]/90 backdrop-blur-md border-b border-border-subtle transition-all">
      {/* Active Emergency Banner if incident in progress */}
      {activeIncident && (
        <div className="bg-status-emergency text-white px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-2 max-w-4xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
            <span className="truncate">
              EMERGENCY ACTIVE: Incident #{activeIncident.incidentId} — Tracking & Trusted Circle Alerted
            </span>
            <Link
              to={`/app/incidents/${activeIncident.incidentId}`}
              className="ml-auto underline hover:text-rose-blush whitespace-nowrap bg-white/20 px-2 py-0.5 rounded"
            >
              Open Command Center →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAppRoute ? '/app/dashboard' : '/'} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center text-ivory-warm shadow-md group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-champagne" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight text-plum font-bold block leading-tight">
              Push Protect
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-text-secondary">
              Women's Safety Circle
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {!isAppRoute ? (
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-text-secondary">
            <Link to="/" className="hover:text-plum transition-colors">Home</Link>
            <Link to="/how-it-works" className="hover:text-plum transition-colors">How It Works</Link>
            <Link to="/about" className="hover:text-plum transition-colors">Our Mission</Link>
            <Link to="/privacy" className="hover:text-plum transition-colors">Privacy by Design</Link>
            <Link to="/contact" className="hover:text-plum transition-colors">Contact</Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-text-secondary">
            <Link
              to="/app/dashboard"
              className={`hover:text-plum transition-colors ${location.pathname === '/app/dashboard' ? 'text-plum font-semibold border-b-2 border-plum pb-1' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/app/device"
              className={`hover:text-plum transition-colors ${location.pathname === '/app/device' ? 'text-plum font-semibold border-b-2 border-plum pb-1' : ''}`}
            >
              Wearable
            </Link>
            <Link
              to="/app/contacts"
              className={`hover:text-plum transition-colors ${location.pathname === '/app/contacts' ? 'text-plum font-semibold border-b-2 border-plum pb-1' : ''}`}
            >
              Trusted Circle
            </Link>
            <Link
              to="/app/journey"
              className={`hover:text-plum transition-colors ${location.pathname === '/app/journey' ? 'text-plum font-semibold border-b-2 border-plum pb-1' : ''}`}
            >
              Safe Journey
            </Link>
            <Link
              to="/app/practice"
              className={`hover:text-plum transition-colors ${location.pathname === '/app/practice' ? 'text-plum font-semibold border-b-2 border-plum pb-1' : ''}`}
            >
              Practice Drill
            </Link>
          </nav>
        )}

        {/* Right Action Area */}
        <div className="flex items-center space-x-3">
          {/* Wearable connection indicator */}
          <Link
            to="/app/device"
            title={isDeviceConnected ? 'Wearable connected via BLE' : 'Wearable disconnected'}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-blush/60 text-plum border border-border-subtle hover:bg-rose-blush transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDeviceConnected ? 'bg-status-success animate-pulse' : 'bg-status-warning'
              }`}
            />
            <span className="hidden sm:inline">
              {isDeviceConnected ? 'Wearable Linked' : 'No Wearable'}
            </span>
            <Bluetooth className="w-3.5 h-3.5 ml-0.5 text-berry" />
          </Link>

          {!isAppRoute ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-plum hover:text-berry px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/app/dashboard"
                className="text-sm font-semibold bg-plum hover:bg-plum-800 text-ivory-warm px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md"
              >
                Launch App
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/app/settings"
                className="p-2 rounded-xl text-text-secondary hover:text-plum hover:bg-rose-blush/50 transition-colors"
                title="Settings"
              >
                <Smartphone className="w-5 h-5" />
              </Link>
              <Link
                to="/app/dashboard"
                className="text-xs font-bold uppercase tracking-wider bg-berry/10 text-berry border border-berry/20 px-2.5 py-1.5 rounded-lg"
              >
                Circle Active
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
