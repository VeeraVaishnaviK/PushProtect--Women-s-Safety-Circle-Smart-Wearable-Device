import React from 'react';
import { Award, Shield, Users, Lock, Heart, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-berry">Our Mission &amp; Origins</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Honest Technology for Everyday Safety
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Push Protect is built on the belief that personal safety tools must provide extreme transparency, privacy by design, and verifiable emergency response workflows.
          </p>
        </div>

        {/* AICTE / MIC IDE Bootcamp Milestone Card */}
        <div className="p-8 rounded-3xl bg-plum text-ivory-warm border border-plum-800 shadow-elevated space-y-4">
          <div className="flex items-center space-x-3 text-champagne">
            <Award className="w-8 h-8" />
            <span className="text-xs uppercase tracking-widest font-bold">Bootcamp Recognition</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            2nd Place Overall &amp; 4/5-Star Investor Evaluation
          </h2>

          <p className="text-xs sm:text-sm text-rose-blush/90 leading-relaxed">
            Push Protect achieved second place overall with a stellar 4/5-star investor evaluation at the prestigious <strong className="text-white">AICTE/MIC IDE Bootcamp Phase 3</strong>, held from <strong className="text-white">11–15 May 2026</strong>.
          </p>

          <p className="text-xs text-rose-blush/80 leading-relaxed">
            Evaluated by leading hardware engineers, venture investors, and cybersecurity mentors, our prototype was commended for its refusal to rely on fabricated AI claims, its implementation of the 5-dimension deterministic Response Confidence Envelope, and its rigorous BLE-to-carrier escalation mechanics.
          </p>
        </div>

        {/* Product Principles Grid */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-plum text-center">
            Our Guiding Safety Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft space-y-2">
              <div className="flex items-center space-x-2 text-plum font-bold text-sm">
                <Shield className="w-4 h-4 text-plum" />
                <span>1. Safety First, Above All</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Emergency activation paths are stripped of unnecessary steps. Activation happens immediately, even before an updated GPS lock is completed.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft space-y-2">
              <div className="flex items-center space-x-2 text-plum font-bold text-sm">
                <Lock className="w-4 h-4 text-plum" />
                <span>2. Privacy by Design</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                No permanent or background location surveillance. Location is ephemeral and purges automatically on resolution according to user policies.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft space-y-2">
              <div className="flex items-center space-x-2 text-plum font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-plum" />
                <span>3. Honest Status Reporting</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                We never tell a user or family member that "Help is on the way" or "Police dispatched" without authenticated carrier delivery and explicit responder acknowledgement.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-border-subtle shadow-soft space-y-2">
              <div className="flex items-center space-x-2 text-plum font-bold text-sm">
                <Users className="w-4 h-4 text-plum" />
                <span>4. Accessible &amp; Inclusive Circle</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Designed for college students, commuting professionals, and solo travellers across varied device specifications and connectivity zones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
