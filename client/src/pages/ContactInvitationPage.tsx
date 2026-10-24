import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';

export const ContactInvitationPage: React.FC = () => {
  const { invitationToken } = useParams<{ invitationToken: string }>();
  const { user } = useSafetyStore();
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-ivory-warm py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-border-subtle p-8 shadow-elevated space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-berry/10 text-berry flex items-center justify-center mx-auto">
          <HeartHandshake className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-champagne bg-plum px-3 py-1 rounded-full">
            Trusted Circle Invitation
          </span>
          <h1 className="font-serif text-2xl font-bold text-plum mt-2">
            {user.displayName} invited you as a Responder
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            By accepting, you will receive emergency notifications via SMS and push whenever {user.displayName} activates their Push Protect wearable SOS.
          </p>
        </div>

        <div className="p-4 bg-ivory-warm rounded-2xl border border-border-subtle/80 text-xs text-text-secondary text-left space-y-2">
          <div className="font-bold text-plum flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-status-success" />
            <span>Your Privacy Protection:</span>
          </div>
          <p>• You will NOT receive continuous tracking of {user.displayName}'s routine movements.</p>
          <p>• Location data is shared strictly during active emergency incidents or missed journey check-ins.</p>
        </div>

        {!accepted ? (
          <button
            onClick={() => setAccepted(true)}
            className="w-full py-3 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors shadow-elevated flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-champagne" />
            <span>Accept Trusted Circle Invitation</span>
          </button>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-status-success font-bold space-y-2 animate-in zoom-in-95">
            <p>✓ You are now registered as a verified emergency contact!</p>
            <Link
              to="/"
              className="inline-block text-plum underline text-[11px] font-semibold"
            >
              Learn more about Push Protect
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
