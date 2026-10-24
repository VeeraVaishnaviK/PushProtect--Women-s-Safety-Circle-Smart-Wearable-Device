import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, PhoneCall, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-plum text-ivory-warm pt-16 pb-12 border-t border-plum-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Milestone / Recognition Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-berry/40 border border-champagne/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-champagne/20 flex items-center justify-center flex-shrink-0 text-champagne">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-widest font-bold text-champagne">Official Recognition</span>
                <span className="text-xs bg-champagne/20 text-champagne px-2 py-0.5 rounded-full font-medium">11–15 May 2026</span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                2nd Place Overall &amp; 4/5-Star Investor Evaluation — AICTE/MIC IDE Bootcamp Phase 3
              </p>
            </div>
          </div>
          <div className="text-xs text-rose-blush/80 md:text-right max-w-sm">
            Recognized for verifiable emergency response architecture, deterministic confidence metrics, and privacy-first wearable design.
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-champagne/20 flex items-center justify-center text-champagne">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">Push Protect</span>
            </div>
            <p className="text-xs text-rose-blush/80 leading-relaxed">
              "Your safety. Your signal. Your circle." Empowering women with wearable-activated discreet emergency coordination, transparent status tracking, and private circle response.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs text-rose-blush border border-white/10">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                <span>Deterministic Signal Verification</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-champagne mb-4">Product Ecosystem</h4>
            <ul className="space-y-2 text-xs text-rose-blush/80">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Wearable Integration (BLE)</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Response Confidence Envelope</Link></li>
              <li><Link to="/app/journey" className="hover:text-white transition-colors">Safe Journey Automated Escort</Link></li>
              <li><Link to="/app/practice" className="hover:text-white transition-colors">Zero-Alarm Practice Drill</Link></li>
              <li><Link to="/app/dashboard" className="hover:text-white transition-colors">PWA &amp; Mobile Web Client</Link></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-champagne mb-4">Trust &amp; Privacy</h4>
            <ul className="space-y-2 text-xs text-rose-blush/80">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy by Design Principles</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Location Ephemerality &amp; Retention</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">No Exaggerated AI Claims</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Circle Consent &amp; Revocation</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Bootcamp &amp; Research Origins</Link></li>
            </ul>
          </div>

          {/* Emergency Advisory */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-status-emergency mb-4 flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>Official Helpline Notice</span>
            </h4>
            <p className="text-xs text-rose-blush/90 leading-relaxed mb-3">
              Push Protect coordinates your personal circle of trusted responders. It is <strong className="text-white">not a replacement</strong> for official police, ambulance, or fire dispatch services.
            </p>
            <div className="p-3 rounded-xl bg-status-emergency/20 border border-status-emergency/40 text-xs">
              <span className="font-bold text-white block">India All-in-One Emergency:</span>
              <a href="tel:112" className="text-base font-bold text-champagne hover:underline inline-flex items-center space-x-1 mt-0.5">
                <span>Dial 112</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="block text-[11px] text-rose-blush/70 mt-1">National Emergency Response Support System (ERSS)</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-plum-800 text-xs text-rose-blush/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Push Protect. All rights reserved. Designed for dignity, security, and peace of mind.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Security Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
