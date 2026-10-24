import React, { useState } from 'react';
import { Users, Phone, MessageSquare, Bell, Shield, Plus, CheckCircle2, UserPlus, X } from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { TrustedContact } from '../types';

interface ContactListProps {
  allowAdd?: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({ allowAdd = true }) => {
  const { contacts, addContact, removeContact, activeIncident } = useSafetyStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Sister');
  const [priority, setPriority] = useState<1 | 2 | 3>(1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addContact({
      name,
      phone,
      relationship,
      escalationPriority: priority,
      notificationPreferences: { sms: true, push: true, calls: priority === 1 },
    });

    setName('');
    setPhone('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-berry/10 flex items-center justify-center text-berry">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum">Trusted Circle</h3>
            <p className="text-xs text-text-secondary">
              {contacts.filter((c) => c.verified).length} verified responders ready
            </p>
          </div>
        </div>

        {allowAdd && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-champagne" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {contacts.map((contact) => {
          // If active incident, find delivery status
          const deliveryAttempt = activeIncident?.deliveryAttempts.find(
            (d) => d.contactId === contact.id
          );

          return (
            <div
              key={contact.id}
              className="p-3.5 rounded-xl bg-ivory-warm border border-border-subtle/80 flex items-center justify-between hover:border-muted-rose/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-rose-blush flex items-center justify-center text-plum font-bold text-xs border border-border-subtle">
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-plum">{contact.name}</span>
                    <span className="text-[10px] bg-berry/10 text-berry font-semibold px-1.5 py-0.5 rounded">
                      {contact.relationship}
                    </span>
                    <span className="text-[10px] bg-champagne/20 text-plum font-semibold px-1.5 py-0.5 rounded">
                      Priority {contact.escalationPriority}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5 flex items-center space-x-2">
                    <span>{contact.phone}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-status-success">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status or actions */}
              <div className="flex items-center space-x-2">
                {deliveryAttempt ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      deliveryAttempt.deliveryStatus === 'acknowledged'
                        ? 'bg-emerald-100 text-status-success border border-emerald-300'
                        : deliveryAttempt.deliveryStatus === 'delivered'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-status-warning border border-amber-300'
                    }`}
                  >
                    {deliveryAttempt.deliveryStatus}
                  </span>
                ) : (
                  <div className="flex items-center space-x-1 text-text-secondary">
                    <span className="w-2 h-2 rounded-full bg-status-success" title="Standby Ready" />
                    <span className="text-[11px] font-medium text-text-secondary">Ready</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border-subtle animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="font-serif text-lg font-bold text-plum">Add Trusted Contact</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary hover:text-plum p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Mobile Number (with country code)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
                  >
                    <option value="Sister">Sister</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Partner">Partner</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Escalation Order</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum"
                  >
                    <option value={1}>1st Responder (Immediate)</option>
                    <option value={2}>2nd Responder (+3 min)</option>
                    <option value={3}>3rd Responder (+6 min)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-plum text-ivory-warm rounded-xl hover:bg-plum-800 transition-colors"
                >
                  Save &amp; Send Verification Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
