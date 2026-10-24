import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { SOSButton } from '../components/SOSButton';
import { ConfidenceEnvelope } from '../components/ConfidenceEnvelope';
import { useSafetyStore } from '../store/safetyStore';

export const PracticePage: React.FC = () => {
  const { getResponseConfidenceEnvelope } = useSafetyStore();
  const [drillCompleted, setDrillCompleted] = useState(false);
  const confidenceData = getResponseConfidenceEnvelope();

  const handleDrillTriggered = () => {
    setDrillCompleted(true);
  };

  const handleResetDrill = () => {
    setDrillCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-champagne/20 text-plum text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-plum" />
          <span>Zero-Alarm Practice Drill</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-plum">
          Emergency Muscle Memory Drill
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Practice triggering your Push Protect SOS safely. This simulation exercises your wearable button, locks GPS coordinates, and runs the entire response workflow <strong className="text-plum">without broadcasting alerts to real contacts or emergency services</strong>.
        </p>
      </div>

      {/* Drill Arena */}
      {!drillCompleted ? (
        <div className="bg-white rounded-3xl border border-border-subtle p-8 shadow-soft text-center space-y-6">
          <div className="max-w-md mx-auto space-y-1">
            <span className="text-xs font-bold text-berry uppercase tracking-wider">
              Step 1 of 1: Practice Activation
            </span>
            <h3 className="text-base font-bold text-plum">
              Hold the button for 1.2s or tap to test grace window
            </h3>
            <p className="text-xs text-text-secondary">
              Notice the haptic vibration and progressive progress ring.
            </p>
          </div>

          <div className="py-6">
            <SOSButton onTriggered={handleDrillTriggered} isPractice={true} />
          </div>

          <div className="p-4 rounded-2xl bg-rose-blush/40 border border-border-subtle/80 max-w-lg mx-auto text-xs text-text-secondary text-left space-y-1.5">
            <div className="font-bold text-plum flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <span>Safety Guarantee</span>
            </div>
            <p>
              Your actual contacts (<span className="font-semibold text-plum">Ananya, Dr. Priya, Rohan</span>) will not be notified during a drill. Real alerts only trigger from the main dashboard or physical hardware in production mode.
            </p>
          </div>
        </div>
      ) : (
        /* Drill Complete Success Celebration */
        <div className="bg-white rounded-3xl border border-border-subtle p-8 shadow-elevated text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-status-success text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8 text-champagne" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-serif text-2xl font-bold text-plum">
              Drill Successfully Completed!
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              You've demonstrated proper trigger mechanics. In an emergency, your paired wearable or in-app button will activate your circle in under 800 milliseconds.
            </p>
          </div>

          {/* Drill Telemetry Snapshot */}
          <div className="max-w-lg mx-auto">
            <ConfidenceEnvelope data={confidenceData} compact={true} />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetDrill}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border-subtle text-plum text-xs font-semibold hover:bg-rose-blush/40 transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>

            <a
              href="/app/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-plum text-ivory-warm text-xs font-bold hover:bg-plum-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-champagne" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
