import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Radio,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bluetooth,
  Navigation,
  Eye,
  Activity,
  PhoneCall,
} from 'lucide-react';
import { SOSButton } from '../components/SOSButton';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background glow & decorative signal wave motifs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-rose-blush/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-champagne/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand Statement & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-blush border border-muted-rose/40 text-plum text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-berry animate-pulse" />
                <span>Smart Women's Safety • Wearable-First</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-plum tracking-tight leading-[1.12]">
                A little signal can make a big difference.
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Push Protect unites a discreet smart wearable with an honest, verifiable emergency response network. One silent press creates an immediate, observable response workflow across your circle—with genuine delivery status and zero artificial claims.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl bg-plum hover:bg-plum-800 text-ivory-warm text-sm font-bold flex items-center justify-center space-x-2 shadow-elevated hover:shadow-soft transition-all group"
                >
                  <span>Get Started with Circle</span>
                  <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="px-6 py-3.5 rounded-xl border border-border-subtle bg-white/80 hover:bg-white text-plum text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <span>Explore How It Works</span>
                </Link>
              </div>

              {/* Privacy Reassurance */}
              <div className="pt-4 flex items-center space-x-6 text-xs text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-berry" />
                  <span>Privacy by Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-berry" />
                  <span>No Permanent Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-berry" />
                  <span>Verifiable Telemetry</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Visual Showcase */}
            <div className="lg:col-span-5 relative">
              {/* Central Mockup Presentation Container */}
              <div className="relative mx-auto max-w-sm rounded-[2.5rem] bg-plum p-4 shadow-2xl border-4 border-plum-800">
                {/* Speaker notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-plum-900 rounded-full z-20" />

                {/* Inner Device Screen */}
                <div className="rounded-[2rem] bg-ivory-warm p-5 text-plum space-y-4 overflow-hidden relative border border-border-subtle">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-text-secondary font-semibold pt-1">
                    <span>9:41 AM</span>
                    <div className="flex items-center space-x-1">
                      <Bluetooth className="w-3.5 h-3.5 text-berry" />
                      <span className="w-2 h-2 rounded-full bg-status-success" />
                    </div>
                  </div>

                  {/* Top Wearable Card Mockup */}
                  <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-sm flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-plum text-champagne flex items-center justify-center font-bold text-xs">
                        PP
                      </div>
                      <div>
                        <div className="text-xs font-bold text-plum">Push Protect Wearable</div>
                        <div className="text-[10px] text-text-secondary">BLE 5.0 • Heart Rate 76 BPM • 88% Battery</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200">
                      Paired
                    </span>
                  </div>

                  {/* Center Interactive SOS demonstration */}
                  <div className="py-4 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#B42335] to-[#713B60] text-white flex flex-col items-center justify-center shadow-sos">
                      <Shield className="w-8 h-8 mb-0.5 text-champagne" />
                      <span className="font-extrabold text-sm tracking-wider">PUSH SOS</span>
                      <span className="text-[9px] opacity-80">Hold 1.2s</span>
                    </div>
                  </div>

                  {/* Mini Confidence Envelope Mockup */}
                  <div className="p-3 bg-white rounded-xl border border-border-subtle shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-plum">
                      <span>Response Confidence Envelope</span>
                      <span className="text-status-success">3/3 Responders Verified</span>
                    </div>
                    <div className="text-[10px] text-text-secondary flex items-center justify-between">
                      <span>GPS Freshness: 14s (Live)</span>
                      <span>Accuracy: ±12m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Wearable Status Card */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-elevated max-w-[220px] hidden sm:block animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-plum mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
                  <span>Wearable Link Online</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Tactile button armed. Background response worker active.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section className="py-20 bg-white border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-berry">Verifiable Protocol</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum">
              How Push Protect Coordinates Your Safety
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              A transparent, 4-stage escalation process that never claims assistance is dispatched without concrete carrier confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-ivory-warm border border-border-subtle relative group hover:border-muted-rose/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-plum mb-2">Activate Wearable</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Discreetly press the physical button on your paired ring or charm. No need to unlock your phone or attract attention.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-ivory-warm border border-border-subtle relative group hover:border-muted-rose/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-plum mb-2">Capture Location</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                The mobile app locks the latest GPS coordinate without delay, tagging timestamp and horizontal accuracy in meters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-ivory-warm border border-border-subtle relative group hover:border-muted-rose/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-plum mb-2">Notify Circle</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Emergency dispatchers queue alerts via SMS &amp; push to your verified contacts in configured priority order.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-ivory-warm border border-border-subtle relative group hover:border-muted-rose/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-plum text-champagne flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-plum mb-2">Track &amp; Acknowledge</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Follow real-time receipt confirmations and explicit contact acknowledgements through the Response Confidence Envelope.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Features Grid */}
      <section className="py-20 bg-ivory-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-berry">Engineering Integrity</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-plum">
              Built on Honest Engineering, Not Empty Promises
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Personal safety requires extreme clarity. We design for edge cases, network deadzones, and verifiable delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Radio className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">One-Touch Wearable SOS</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                BLE-connected hardware button activates emergency procedures with zero screen interaction. Replay protection and authenticated pairing ensure reliability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Activity className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">Response Confidence Envelope</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Our signature 5-dimension deterministic metric exposes freshness, accuracy, carrier dispatch status, contact replies, and hardware connectivity without fabricated percentages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Compass className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">Safe Journey Automated Escort</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Traveling late? Set destination and expected arrival. Periodic 1-tap check-ins ensure you are safe; missed check-ins trigger automated circle escalation with grace periods.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Navigation className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">Location-Aware Assistance</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Never labels stale coordinates as live. Non-blocking capture sends the initial SOS immediately and updates coordinates smoothly as finer GPS locks arrive.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Users className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">Tiered Circle Escalation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Organize trusted contacts by primary, secondary, and tertiary responders. If primary responder doesn't acknowledge within 3 minutes, alerts escalate systematically.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-7 rounded-2xl bg-white border border-border-subtle shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
                <Lock className="w-6 h-6 text-plum" />
              </div>
              <h3 className="text-base font-bold text-plum">Privacy by Design</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Zero continuous background surveillance. Location is only captured upon deliberate SOS or active Safe Journey. Temporary links expire automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-plum text-ivory-warm">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Ready to empower your personal safety circle?
          </h2>
          <p className="text-sm sm:text-base text-rose-blush/80 max-w-2xl mx-auto">
            Take complete control of your emergency signal. Join thousands of women, solo commuters, and college students building proactive safety circles.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-champagne text-plum font-bold rounded-xl text-sm hover:bg-champagne-light transition-colors shadow-elevated"
            >
              Set Up Your Circle in 2 Minutes
            </Link>
            <Link
              to="/app/dashboard"
              className="px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-colors border border-white/20"
            >
              Enter Live Demo App
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
