import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

interface SOSButtonProps {
  onTriggered?: (incidentId: string) => void;
  size?: 'normal' | 'large';
  isPractice?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onTriggered,
  size = 'large',
  isPractice = false,
}) => {
  const { triggerSOS, activeIncident, cancelIncident } = useSafetyStore();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const holdTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const HOLD_DURATION_MS = 1200; // 1.2s deliberate press prevents accidental touch

  const handleStartHold = () => {
    if (activeIncident && !isPractice) return;
    setHolding(true);
    setProgress(0);

    // Haptic feedback if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(50);
      } catch {}
    }

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION_MS) {
        clearInterval(progressIntervalRef.current);
        handleConfirmedTrigger();
      }
    }, 20);
  };

  const handleEndHold = () => {
    if (progress < 100) {
      clearInterval(progressIntervalRef.current);
      setHolding(false);
      setProgress(0);
    }
  };

  const handleConfirmedTrigger = async () => {
    setHolding(false);
    setProgress(100);

    // Stronger haptic confirmation
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 200]);
      } catch {}
    }

    const incident = await triggerSOS(isPractice ? 'practice_drill' : 'app_sos');
    if (onTriggered) {
      onTriggered(incident.incidentId);
    }
  };

  // Instant emergency trigger option (double tap / direct tap)
  const handleQuickTap = () => {
    // If not holding, offer a 3-second grace window to cancel before irreversible broadcast
    if (countdown === null && !activeIncident) {
      setCountdown(3);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(80);
        } catch {}
      }

      let count = 3;
      countdownIntervalRef.current = setInterval(async () => {
        count -= 1;
        if (count <= 0) {
          clearInterval(countdownIntervalRef.current);
          setCountdown(null);
          await handleConfirmedTrigger();
        } else {
          setCountdown(count);
        }
      }, 1000);
    }
  };

  const cancelGracePeriod = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(progressIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const isEmergencyActive = Boolean(activeIncident && !isPractice);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Grace countdown cancellation banner */}
      {countdown !== null && (
        <div className="mb-4 bg-status-emergency text-white px-5 py-2.5 rounded-2xl shadow-elevated flex items-center space-x-4 animate-bounce">
          <span className="font-bold text-sm">
            Broadcasting SOS in {countdown}s...
          </span>
          <button
            onClick={cancelGracePeriod}
            className="flex items-center space-x-1 px-3 py-1 bg-white text-status-emergency font-bold text-xs rounded-xl hover:bg-rose-blush transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Main Circular SOS Button */}
      <div className="relative flex items-center justify-center">
        {/* Outer animated rings when emergency is active */}
        {isEmergencyActive && (
          <>
            <div className="absolute w-56 h-56 rounded-full border-4 border-status-emergency/40 animate-ping opacity-60 pointer-events-none" />
            <div className="absolute w-64 h-64 rounded-full bg-status-emergency/15 animate-pulse pointer-events-none" />
          </>
        )}

        {/* SVG Progress Ring for Hold-to-Activate */}
        <svg
          className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90 pointer-events-none"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            className="stroke-border-subtle"
            strokeWidth="5"
            fill="transparent"
          />
          {holding && (
            <circle
              cx="50"
              cy="50"
              r="46"
              className="stroke-status-emergency transition-all duration-75"
              strokeWidth="6"
              strokeDasharray={289}
              strokeDashoffset={289 - (289 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          )}
        </svg>

        {/* Tactile SOS Button */}
        <button
          type="button"
          onMouseDown={handleStartHold}
          onMouseUp={handleEndHold}
          onMouseLeave={handleEndHold}
          onTouchStart={handleStartHold}
          onTouchEnd={handleEndHold}
          onClick={handleQuickTap}
          aria-label={isEmergencyActive ? 'Emergency Active' : 'Activate SOS Emergency Alert'}
          className={`relative z-10 rounded-full flex flex-col items-center justify-center text-white transition-all transform active:scale-95 select-none focus:outline-none focus:ring-4 focus:ring-status-emergency/30 ${
            size === 'large' ? 'w-44 h-44 sm:w-48 sm:h-48' : 'w-32 h-32'
          } ${
            isEmergencyActive
              ? 'bg-status-emergency shadow-sos-active animate-pulse'
              : holding
              ? 'bg-red-800 scale-98 shadow-sos'
              : isPractice
              ? 'bg-berry hover:bg-plum shadow-soft'
              : 'bg-gradient-to-br from-[#B42335] to-[#713B60] hover:from-[#C92A40] hover:to-[#5A2E52] shadow-sos'
          }`}
        >
          <ShieldAlert
            className={`${size === 'large' ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-8 h-8'} mb-1 ${
              holding ? 'scale-110' : ''
            } transition-transform`}
          />
          <span className="font-extrabold tracking-wider text-xl sm:text-2xl uppercase">
            {isEmergencyActive ? 'ACTIVE' : isPractice ? 'DRILL SOS' : 'PUSH SOS'}
          </span>
          <span className="text-[11px] font-medium tracking-wide opacity-90 mt-0.5">
            {holding
              ? 'HOLD TO SEND...'
              : isEmergencyActive
              ? 'Circle Notified'
              : 'Hold 1.2s or Tap'}
          </span>
        </button>
      </div>

      {/* Safety Subtext */}
      <div className="mt-4 text-center max-w-xs">
        <p className="text-xs text-text-secondary font-medium">
          {isEmergencyActive
            ? 'Broadcast in progress. Location coordinates and incident stream are live.'
            : isPractice
            ? 'Practice mode: Tests BLE hardware and app flow safely without real alerts.'
            : 'Press and hold for 1.2s to alert your trusted circle with real-time location.'}
        </p>
      </div>
    </div>
  );
};
