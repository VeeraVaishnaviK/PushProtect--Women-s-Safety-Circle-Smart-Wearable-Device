import React from 'react';
import { Users, Shield, HeartHandshake, BellRing } from 'lucide-react';
import { ContactList } from '../components/ContactList';

export const ContactsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Trusted Safety Circle
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Configure trusted emergency responders, verification status, and escalation priority.
        </p>
      </div>

      {/* Escalation Policy Card */}
      <div className="p-4 rounded-2xl bg-rose-blush/40 border border-border-subtle flex items-start space-x-3 text-xs text-text-primary">
        <BellRing className="w-5 h-5 text-berry flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-plum">How Tiered Escalation Works</span>
          <p className="text-text-secondary leading-relaxed">
            When you trigger an SOS, <strong className="text-plum">Priority 1 (Primary)</strong> responders receive immediate SMS and push alerts. If no acknowledgement is received within 3 minutes, the platform automatically escalates to <strong className="text-plum">Priority 2</strong> and <strong className="text-plum">Priority 3</strong> responders.
          </p>
        </div>
      </div>

      <ContactList allowAdd={true} />
    </div>
  );
};
