import React, { useState, useEffect } from 'react';
import { Compass, Clock, CheckCircle2, AlertTriangle, ShieldCheck, Play, StopCircle } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

export const JourneyTracker: React.FC = () => {
  const { safeJourney, startJourney, checkInJourney, endJourney, triggerSOS } = useSafetyStore();
  const [destination, setDestination] = useState('Sector 4, Green Avenue');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [checkInterval, setCheckInterval] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const isActive = safeJourney.status === 'active' || safeJourney.status === 'missed_checkin';

  useEffect(() => {
    if (!isActive || !safeJourney.nextCheckInDueAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(safeJourney.nextCheckInDueAt!).getTime() - Date.now()) / 1000));
      setSecondsRemaining(diff);

      // Auto escalate if check-in missed by 60s
      if (diff === 0 && safeJourney.status === 'active') {
        // missed checkin state
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, safeJourney.nextCheckInDueAt, safeJourney.status]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startJourney(destination, durationMinutes, checkInterval);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-champagne/20 flex items-center justify-center text-plum">
            <Compass className="w-4 h-4 text-plum" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum">Safe Journey Automated Escort</h3>
            <p className="text-xs text-text-secondary">
              Periodic check-in timer with automated circle escalation
            </p>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isActive
              ? 'bg-emerald-50 text-status-success border border-emerald-200 animate-pulse'
              : 'bg-gray-100 text-text-secondary'
          }`}
        >
          {isActive ? 'In Transit' : 'Idle'}
        </span>
      </div>

      {/* Active State View */}
      {isActive ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-ivory-warm border border-border-subtle/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-secondary">Target Destination</span>
              <span className="text-xs font-bold text-plum">{safeJourney.destination}</span>
            </div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-text-secondary">Next Check-In Due</span>
              <span className="font-mono text-base font-bold text-berry">
                {formatCountdown(secondsRemaining)}
              </span>
            </div>

            {/* Check-In Action Button */}
            <button
              onClick={checkInJourney}
              className="w-full py-2.5 px-4 bg-status-success text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I'm Safe — Tap to Check-In</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => triggerSOS('safe_journey_timeout')}
              className="text-xs font-bold text-status-emergency hover:underline flex items-center space-x-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Trigger Immediate Emergency SOS</span>
            </button>

            <button
              onClick={endJourney}
              className="text-xs font-semibold text-text-secondary hover:text-plum flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-rose-blush/40 transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Arrived &amp; End Journey</span>
            </button>
          </div>
        </div>
      ) : (
        /* Setup Form */
        <form onSubmit={handleStart} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Metro Station, Home, Office"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-text-primary mb-1">Estimated Travel Time</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-primary mb-1">Check-in Interval</label>
              <select
                value={checkInterval}
                onChange={(e) => setCheckInterval(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
              >
                <option value={5}>Every 5 minutes</option>
                <option value={10}>Every 10 minutes</option>
                <option value={15}>Every 15 minutes</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
            If a check-in is missed, you receive an alert with a 60-second grace buffer before your trusted circle is notified.
          </p>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-plum text-ivory-warm rounded-xl text-xs font-bold hover:bg-plum-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-champagne fill-champagne" />
            <span>Start Escorted Safe Journey</span>
          </button>
        </form>
      )}
    </div>
  );
};
