import React from 'react';
import { Shield, Users, Lock, Heart, CheckCircle2 } from 'lucide-react';

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
