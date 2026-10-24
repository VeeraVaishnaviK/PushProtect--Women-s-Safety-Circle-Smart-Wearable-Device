import React from 'react';
import { Bluetooth, Radio, Navigation, BellRing, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-berry">Technical Architecture</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            The Verified Response Pipeline
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Understanding how an ESP32 wearable trigger transitions through BLE, mobile runtime, backend event processing, and multi-channel circle dispatch.
          </p>
        </div>

        {/* Deep Dive Architecture Steps */}
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-lg flex-shrink-0">
              01
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-plum">Discreet Physical Activation via BLE 5.0</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                The wearable button (ESP32-S3 microcontroller) communicates over an authenticated Bluetooth Low Energy connection. A short 1.2-second hold emits a cryptographic event ID, preventing replay attacks and false activation from everyday pocket movements.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-lg flex-shrink-0">
              02
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-plum">Non-Blocking Geolocation Snapshot</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Emergency systems must never pause activation while waiting for a fresh GPS lock. Push Protect instantly packages the latest known coordinates with horizontal accuracy (in meters) and timestamps. If a finer satellite fix arrives seconds later, the incident updates smoothly.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-lg flex-shrink-0">
              03
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-plum">Multi-Channel Carrier Dispatch &amp; Escalation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                The NestJS backend processes the incident idempotently and queues alerts via SMS and FCM push notifications. If Priority 1 responders do not open the response portal within 3 minutes, automated secondary escalation engages Priority 2 contacts.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft flex flex-col md:flex-row gap-6 items-start">
            <div className="w-12 h-12 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-lg flex-shrink-0">
              04
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-plum">Deterministic Response Confidence Envelope</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Both the wearer and trusted contacts see real-time status across 5 verifiable dimensions: GPS freshness, accuracy radius, carrier receipt status, contact acknowledgements, and hardware connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
