import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Bluetooth,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { bleAdapter } from '../services/bleAdapter';
import { SOSButton } from '../components/SOSButton';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, setDevice, addContact } = useSafetyStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('Vaishnavi');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [email, setEmail] = useState('vaishnavi@pushprotect.org');
  const [password, setPassword] = useState('SafetyFirst2026!');

  // Onboarding contacts input
  const [contactName, setContactName] = useState('Ananya Sharma');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactRelation, setContactRelation] = useState('Sister');

  // Drill completed flag for Step 7
  const [drillCompleted, setDrillCompleted] = useState(false);

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      setUser({ displayName: name, phone, email, onboardingCompleted: true });
      navigate('/app/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-warm py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-border-subtle p-8 shadow-elevated">
        {/* Progress header */}
        <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-plum text-champagne flex items-center justify-center font-bold text-xs">
              PP
            </div>
            <span className="font-serif font-bold text-plum text-lg">Push Protect Setup</span>
          </div>
          <span className="text-xs font-bold text-berry bg-rose-blush px-2.5 py-1 rounded-full">
            Step {step} of 7
          </span>
        </div>

        {/* Step 1: Welcome to Push Protect */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-plum">
                Welcome to Push Protect
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                "Your safety. Your signal. Your circle." Let's create your account and configure your emergency response network.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:ring-2 focus:ring-plum"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: How wearable and app work together */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-blush text-plum flex items-center justify-center mx-auto">
              <Bluetooth className="w-7 h-7 text-plum" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-plum">
              How Wearable &amp; App Coordinate
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
              Push Protect pairs a lightweight BLE physical device (smart ring or charm) with your phone. A single silent click sends a hardware trigger over BLE to the mobile app, which immediately captures GPS coordinates and queues multi-channel alerts to your trusted responders.
            </p>

            <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80 text-xs text-text-secondary text-left space-y-2 mt-4">
              <div className="font-bold text-plum">Key Hardware Principles:</div>
              <p>• Completely silent activation without lighting up your smartphone screen.</p>
              <p>• Phone handles cellular transmission; future hardware revisions will support standalone cellular eSIM.</p>
            </div>
          </div>
        )}

        {/* Step 3: Location permission only when needed */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in text-center">
            <div className="w-14 h-14 rounded-2xl bg-berry/10 text-berry flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-plum">
              Privacy-First Location Sharing
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
              We never run continuous 24/7 background tracking on your movements. Location access is only utilized upon deliberate SOS activation or during an active Safe Journey you choose to start.
            </p>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-status-success text-left flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Location permissions requested: <strong>High-accuracy GPS</strong> with horizontal accuracy tags in meters.
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Pair wearable or demo mode */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in text-center">
            <h2 className="font-serif text-2xl font-bold text-plum">
              Pair Your Wearable Device
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
              Pair your ESP32-compatible SOS button, or continue in simulated mode for testing on your current computer or phone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => bleAdapter.scanAndConnectReal()}
                className="p-4 rounded-xl border border-border-subtle bg-white hover:bg-rose-blush/30 text-xs font-bold text-plum space-y-1 text-center"
              >
                <Bluetooth className="w-6 h-6 mx-auto text-plum" />
                <span className="block">Scan Web Bluetooth</span>
              </button>

              <button
                type="button"
                onClick={() => bleAdapter.simulatePairing()}
                className="p-4 rounded-xl border-2 border-plum bg-ivory-warm text-xs font-bold text-plum space-y-1 text-center shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 mx-auto text-status-success" />
                <span className="block">Use Simulated Device (Demo)</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Add trusted contacts */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h2 className="font-serif text-2xl font-bold text-plum">
                Add Your First Responder
              </h2>
              <p className="text-xs text-text-secondary">
                Enter your closest family member or trusted confidant.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Relationship</label>
                <select
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle"
                >
                  <option value="Sister">Sister</option>
                  <option value="Mother">Mother</option>
                  <option value="Friend">Friend</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Alert delivery limitations & incident states */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h2 className="font-serif text-2xl font-bold text-plum">
                Understanding Incident States
              </h2>
              <p className="text-xs text-text-secondary">
                We believe in honest status reporting without fabricated guarantees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle text-xs space-y-2 text-text-secondary">
              <div className="flex items-center space-x-2 text-plum font-bold">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <span>Our Engineering Truths:</span>
              </div>
              <p>• <strong>Incident Registered:</strong> Recorded on backend with GPS fix.</p>
              <p>• <strong>Provider Accepted:</strong> SMS telecom provider accepted queue payload.</p>
              <p>• <strong>Handset Delivered:</strong> Delivery receipt acknowledged by cellular carrier.</p>
              <p>• <strong>Contact Acknowledged:</strong> Trusted responder actively opened alert link.</p>
              <p className="pt-2 text-status-emergency font-semibold">
                • Push Protect does NOT automatically dispatch police or ambulance services. In immediate danger, always call 112.
              </p>
            </div>
          </div>
        )}

        {/* Step 7: Zero-alarm practice drill */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in text-center">
            <h2 className="font-serif text-2xl font-bold text-plum">
              Zero-Alarm Practice Drill
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md mx-auto">
              Test your trigger mechanics now. Hold the button for 1.2s to complete your onboarding drill safely without notifying anyone.
            </p>

            <div className="py-4">
              <SOSButton onTriggered={() => setDrillCompleted(true)} isPractice={true} />
            </div>

            {drillCompleted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-status-success font-bold flex items-center justify-center space-x-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4" />
                <span>Drill Complete! You are fully prepared to use Push Protect.</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-border-subtle flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-border-subtle text-xs font-semibold text-plum rounded-xl hover:bg-rose-blush/40 transition-colors flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors flex items-center space-x-2 shadow-elevated"
          >
            <span>{step === 7 ? 'Finish & Launch Hub' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4 text-champagne" />
          </button>
        </div>
      </div>
    </div>
  );
};
