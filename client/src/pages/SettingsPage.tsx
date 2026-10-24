import React, { useState } from 'react';
import { Smartphone, Bell, Vibrate, Volume2, Shield, Save, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [loudAlarmFallback, setLoudAlarmFallback] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Application Preferences
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Customize vibration cues, fallback alarm modes, and device feedback.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft space-y-6">
        <div className="space-y-4">
          {/* Haptic Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-ivory-warm rounded-xl border border-border-subtle/80">
            <div className="flex items-center space-x-3">
              <Vibrate className="w-5 h-5 text-plum" />
              <div>
                <span className="text-xs font-bold text-plum block">Tactile Haptic Feedback</span>
                <span className="text-[11px] text-text-secondary">
                  Vibrates discretely when SOS is held, confirmed, or cancelled.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hapticFeedback}
              onChange={(e) => setHapticFeedback(e.target.checked)}
              className="w-4 h-4 accent-plum rounded cursor-pointer"
            />
          </div>

          {/* Fallback Siren / Loud Alarm */}
          <div className="flex items-center justify-between p-3.5 bg-ivory-warm rounded-xl border border-border-subtle/80">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-plum" />
              <div>
                <span className="text-xs font-bold text-plum block">Secondary Audible Siren (Optional)</span>
                <span className="text-[11px] text-text-secondary">
                  Default is SILENT for discretion. Enable only if you want phone speaker alarm during escalation.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={loudAlarmFallback}
              onChange={(e) => setLoudAlarmFallback(e.target.checked)}
              className="w-4 h-4 accent-plum rounded cursor-pointer"
            />
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-status-success flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Preferences successfully saved.</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <Save className="w-4 h-4 text-champagne" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
