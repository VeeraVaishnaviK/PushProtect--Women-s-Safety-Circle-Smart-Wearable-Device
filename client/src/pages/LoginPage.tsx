import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Lock, Phone } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useSafetyStore();
  const [identifier, setIdentifier] = useState('+91 98765 00000');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ displayName: 'Vaishnavi R.', phone: identifier, onboardingCompleted: true });
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-border-subtle p-8 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-plum text-champagne flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-plum">Welcome to Push Protect</h1>
          <p className="text-xs text-text-secondary">
            Sign in to access your personal safety hub and circle settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Mobile Number or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-plum rounded" />
              <span>Remember circle</span>
            </label>
            <a href="#" className="text-plum hover:underline font-semibold">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors flex items-center justify-center space-x-2 shadow-elevated mt-2"
          >
            <span>Sign In to Safety Circle</span>
            <ArrowRight className="w-4 h-4 text-champagne" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border-subtle text-xs text-text-secondary">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-plum hover:underline">
            Register with 7-Step Onboarding
          </Link>
        </div>
      </div>
    </div>
  );
};
