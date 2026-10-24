import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  ShieldAlert,
  Clock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Navigation,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  Users,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { LiveMap } from '../components/LiveMap';
import { ConfidenceEnvelope } from '../components/ConfidenceEnvelope';
import { LocationService } from '../services/locationService';

export const IncidentDetailPage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const {
    activeIncident,
    incidentHistory,
    cancelIncident,
    resolveIncident,
    refreshLocation,
    getResponseConfidenceEnvelope,
    acknowledgeIncidentByContact,
    contacts,
  } = useSafetyStore();

  const [resolveNotes, setResolveNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Find incident either in active or history
  const incident =
    activeIncident?.incidentId === incidentId
      ? activeIncident
      : incidentHistory.find((i) => i.incidentId === incidentId);

  if (!incident) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-plum">Incident Not Found</h2>
        <p className="text-xs text-text-secondary">
          No incident record matches ID "{incidentId}".
        </p>
        <Link
          to="/app/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-bold text-plum hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const isResolvedOrCancelled = incident.status === 'resolved' || incident.status === 'cancelled';
  const confidenceData = getResponseConfidenceEnvelope(incident);
  const freshness = LocationService.calculateFreshness(incident.location.capturedAt);

  const handleConfirmCancel = () => {
    cancelIncident(incident.id);
    setShowCancelModal(false);
    navigate('/app/dashboard');
  };

  const handleConfirmResolve = () => {
    resolveIncident(incident.id, resolveNotes);
    setShowResolveModal(false);
    navigate('/app/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
        <div className="flex items-center space-x-3">
          <Link
            to="/app/dashboard"
            className="p-2 rounded-xl border border-border-subtle bg-white hover:bg-rose-blush/40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-plum" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-berry bg-berry/10 px-2 py-0.5 rounded">
                Incident #{incident.incidentId}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  incident.status === 'resolved'
                    ? 'bg-emerald-100 text-status-success'
                    : incident.status === 'cancelled'
                    ? 'bg-gray-200 text-text-secondary'
                    : 'bg-status-emergency text-white animate-pulse'
                }`}
              >
                {incident.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-plum mt-1">
              Incident Response Command Center
            </h1>
          </div>
        </div>

        {/* 112 Direct Dial Helpline */}
        <div className="flex items-center space-x-3">
          <a
            href="tel:112"
            className="px-4 py-2.5 bg-status-emergency text-white rounded-xl text-xs font-bold flex items-center space-x-2 hover:bg-red-800 transition-colors shadow-elevated"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 India Helpline</span>
          </a>
        </div>
      </div>

      {/* Main Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Map, Location Integrity & Confidence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Map Panel */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle/80">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-plum" />
                <h3 className="text-sm font-bold text-plum">Emergency Location Telemetry</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-semibold text-text-secondary bg-rose-blush px-2 py-0.5 rounded-full">
                  {freshness.label}
                </span>
                {!isResolvedOrCancelled && (
                  <button
                    onClick={() => refreshLocation()}
                    className="p-1 rounded text-text-secondary hover:text-plum"
                    title="Refresh GPS snapshot"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <LiveMap
              location={incident.location}
              isEmergency={!isResolvedOrCancelled}
              height="300px"
            />

            <div className="p-3 bg-ivory-warm rounded-xl text-xs text-text-secondary space-y-1">
              <div className="flex justify-between">
                <span>Horizontal GPS Accuracy:</span>
                <span className="font-bold text-plum">±{incident.location.accuracyMeters} meters</span>
              </div>
              <div className="flex justify-between">
                <span>Time of Initial Fix:</span>
                <span className="font-mono text-plum">{new Date(incident.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Response Confidence Envelope */}
          <ConfidenceEnvelope data={confidenceData} />

          {/* Resolution & Cancellation Controls */}
          {!isResolvedOrCancelled && (
            <div className="p-5 rounded-2xl bg-white border border-border-subtle shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-plum">Are you safe?</h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Resolve this incident with a note to notify your circle, or cancel if triggered accidentally.
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-border-subtle text-text-secondary hover:text-plum text-xs font-semibold rounded-xl hover:bg-rose-blush/40 transition-colors"
                >
                  Cancel (False Alarm)
                </button>
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="flex-1 sm:flex-none px-5 py-2 bg-status-success text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Mark Safe &amp; Resolve
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Circle Delivery Status & Chronological Audit Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trusted Circle Delivery & Ack Status */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-plum" />
                <h3 className="text-sm font-bold text-plum">Circle Dispatch &amp; Receipts</h3>
              </div>
              <span className="text-[11px] font-bold text-berry">
                {incident.deliveryAttempts.filter((d) => d.deliveryStatus === 'acknowledged').length} of{' '}
                {incident.deliveryAttempts.length} Acknowledged
              </span>
            </div>

            <div className="space-y-3">
              {incident.deliveryAttempts.map((attempt) => (
                <div
                  key={attempt.contactId}
                  className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/80 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-plum block">{attempt.contactName}</span>
                      <span className="text-[10px] text-text-secondary">
                        {attempt.relationship} • {attempt.channel.toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        attempt.deliveryStatus === 'acknowledged'
                          ? 'bg-emerald-100 text-status-success border border-emerald-300'
                          : attempt.deliveryStatus === 'delivered'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-status-warning border border-amber-300'
                      }`}
                    >
                      {attempt.deliveryStatus}
                    </span>
                  </div>

                  <div className="text-[10px] text-text-secondary border-t border-border-subtle/60 pt-1.5 flex justify-between">
                    <span>Provider Ref: {attempt.providerReference || 'Pending'}</span>
                    <span>
                      {attempt.acknowledgedAt
                        ? `Ack at ${new Date(attempt.acknowledgedAt).toLocaleTimeString()}`
                        : attempt.deliveredAt
                        ? `Delivered at ${new Date(attempt.deliveredAt).toLocaleTimeString()}`
                        : 'Dispatch in-flight'}
                    </span>
                  </div>

                  {/* Simulation Helper button for testing contact response */}
                  {!isResolvedOrCancelled && attempt.deliveryStatus !== 'acknowledged' && (
                    <div className="pt-1">
                      <button
                        onClick={() => acknowledgeIncidentByContact(incident.id, attempt.contactId)}
                        className="text-[11px] font-bold text-berry hover:underline flex items-center space-x-1"
                      >
                        <Send className="w-3 h-3 text-champagne" />
                        <span>Simulate {attempt.contactName} Acknowledging</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-rose-blush/40 text-[11px] text-text-secondary">
              <strong>Escalation Policy:</strong> If primary contact does not open response link within 3 minutes, automated secondary push and voice alert trigger.
            </div>
          </div>

          {/* Chronological Audit Event Timeline */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
            <h3 className="text-sm font-bold text-plum pb-3 border-b border-border-subtle/80 mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-plum" />
              <span>Verifiable Event Timeline</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle">
              {incident.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative text-xs">
                  <span className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-plum border-2 border-white ring-2 ring-rose-blush" />
                  <div className="flex items-center justify-between text-text-secondary text-[10px]">
                    <span className="font-semibold text-plum">{event.actor}</span>
                    <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="font-bold text-plum mt-0.5 text-xs">{event.action.replace('_', ' ')}</p>
                  <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mark Safe & Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border-subtle animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-lg font-bold text-plum mb-2">Mark Incident as Resolved</h3>
            <p className="text-xs text-text-secondary mb-4">
              Your trusted contacts will receive an update confirming that you are safe and that emergency response can stand down.
            </p>

            <textarea
              rows={3}
              placeholder="Optional note: e.g. 'Reached destination safely. All good!'"
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-plum mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-5 py-2 text-xs font-bold bg-status-success text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-border-subtle animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-lg font-bold text-plum mb-2">Cancel False Alarm</h3>
            <p className="text-xs text-text-secondary mb-4">
              Cancelling confirms this was an inadvertent trigger. A cancellation notice will be recorded in the audit log.
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 rounded-xl"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-xs font-bold bg-status-emergency text-white rounded-xl hover:bg-red-800 transition-colors"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
