import React from 'react';
import { Lock, Shield, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-berry">Privacy Policy</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-plum">
            Privacy by Design Commitment
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your safety should never come at the cost of your personal privacy or perpetual surveillance.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border-subtle p-8 shadow-soft space-y-6 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-plum">1. Zero Continuous Tracking</h3>
            <p>
              Push Protect does not collect, record, or track your background location during ordinary daily use. Coordinates are requested by the operating system exclusively upon:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>An explicit emergency SOS trigger (via wearable or in-app button).</li>
              <li>An active Safe Journey started explicitly by you with scheduled check-in intervals.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-plum">2. Ephemeral Data Retention &amp; Automatic Purging</h3>
            <p>
              Location snapshots associated with resolved incidents are subject to strict retention policies (default: 7 days). Once resolved or cancelled, temporary responder links expire automatically. All coordinate breadcrumbs are automatically purged from our MongoDB Atlas clusters.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-plum">3. Encrypted Credentials &amp; Replay Protection</h3>
            <p>
              Wearable BLE pairings utilize cryptographic event tokens and nonces to protect against event replay attacks. User authentication tokens are securely stored in operating system keychains when running natively via Capacitor.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-plum">4. Right to Deletion &amp; Data Portability</h3>
            <p>
              You have the unconditional right to export your complete incident and circle history at any time, or request complete account deletion and database record erasure directly from your privacy settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
