import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';
import { JourneyTracker } from '../components/JourneyTracker';

export const JourneyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Safe Journey Escort
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Automated check-ins for evening commutes, solo travel, and late rides.
        </p>
      </div>

      <JourneyTracker />

      {/* Safety Notice */}
      <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-soft text-xs text-text-secondary space-y-2">
        <h3 className="font-bold text-plum text-sm">Privacy Guarantee During Journeys</h3>
        <p className="leading-relaxed">
          Push Protect does not transmit continuous live turn-by-turn route telemetry to third parties. Your coordinates are only shared if a scheduled check-in is missed past the 60-second grace window, or if you explicitly trigger an emergency SOS.
        </p>
      </div>
    </div>
  );
};
