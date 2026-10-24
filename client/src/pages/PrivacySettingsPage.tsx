import React, { useState } from 'react';
import { Lock, Shield, Trash2, Download, CheckCircle2, AlertTriangle, EyeOff } from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  const [retentionPeriod, setRetentionPeriod] = useState('7');
  const [ephemeralSharing, setEphemeralSharing] = useState(true);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportData = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 4000);
  };

  const handleDeleteRequest = () => {
    if (confirm('Are you sure you want to request complete account and data deletion?')) {
      setDeleteRequested(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
          Privacy by Design Controls
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Full ownership of your telemetry data, retention policies, and deletion rights.
        </p>
      </div>

      {/* Retention Policy */}
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-border-subtle">
          <div className="w-10 h-10 rounded-xl bg-plum/10 text-plum flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum">Location Data Retention Window</h3>
            <p className="text-xs text-text-secondary">
              Configure how long resolved incident GPS breadcrumbs are retained before automatic irreversible purging.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-ivory-warm rounded-xl border border-border-subtle/80">
            <div>
              <span className="text-xs font-bold text-plum block">Automatic Purge Schedule</span>
              <span className="text-[11px] text-text-secondary">
                Coordinates are permanently erased from MongoDB Atlas after this duration.
              </span>
            </div>
            <select
              value={retentionPeriod}
              onChange={(e) => setRetentionPeriod(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-subtle bg-white text-plum"
            >
              <option value="24h">24 Hours (Maximum Privacy)</option>
              <option value="7">7 Days (Recommended)</option>
              <option value="30">30 Days</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-ivory-warm rounded-xl border border-border-subtle/80">
            <div>
              <span className="text-xs font-bold text-plum block">Ephemeral Link Expiration</span>
              <span className="text-[11px] text-text-secondary">
                Trusted contact response links automatically expire 2 hours after incident resolution.
              </span>
            </div>
            <span className="text-xs font-bold text-status-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Export & Deletion */}
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-plum pb-3 border-b border-border-subtle">
          Data Portability &amp; Digital Rights
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-ivory-warm rounded-xl border border-border-subtle/80">
            <div>
              <span className="text-xs font-bold text-plum block">Export Personal Safety Audit Archive</span>
              <span className="text-[11px] text-text-secondary">
                Download a JSON archive of your incident timeline and consent history.
              </span>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-plum text-ivory-warm text-xs font-bold rounded-xl hover:bg-plum-800 transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-champagne" />
              <span>Download Archive</span>
            </button>
          </div>

          {exportNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-status-success flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Safety archive compiled and ready for secure download.</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50/50 rounded-xl border border-status-emergency/20">
            <div>
              <span className="text-xs font-bold text-status-emergency block">Delete Account &amp; Purge All Records</span>
              <span className="text-[11px] text-text-secondary">
                Permanently revoke device tokens, wipe MongoDB collections, and unlink trusted contacts.
              </span>
            </div>
            <button
              onClick={handleDeleteRequest}
              disabled={deleteRequested}
              className="px-4 py-2 border border-status-emergency text-status-emergency hover:bg-status-emergency hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 self-start sm:self-auto disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deleteRequested ? 'Deletion Request Queued' : 'Request Account Deletion'}</span>
            </button>
          </div>

          {deleteRequested && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-status-warning flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Account deletion request registered. In accordance with privacy regulations, all telemetry and credentials will be purged within 48 hours.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
