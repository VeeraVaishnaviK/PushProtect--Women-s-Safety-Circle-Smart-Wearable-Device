import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  PhoneCall,
  Navigation,
  CheckCircle2,
  ExternalLink,
  Clock,
  AlertTriangle,
  Heart,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { LiveMap } from '../components/LiveMap';
import { LocationService } from '../services/locationService';

export const ContactResponsePage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const { activeIncident, incidentHistory, acknowledgeIncidentByContact, contacts } = useSafetyStore();
  const [acknowledged, setAcknowledged] = useState(false);

  const incident =
    activeIncident?.incidentId === incidentId
      ? activeIncident
      : incidentHistory.find((i) => i.incidentId === incidentId);

  const primaryContact = contacts[0] || { id: 'tc-1', name: 'Trusted Contact', phone: '+91 98765 43210' };

  const handleAcknowledge = () => {
    if (incident) {
      acknowledgeIncidentByContact(incident.id, primaryContact.id);
      setAcknowledged(true);
    }
  };

  if (!incident) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-border-subtle max-w-md w-full text-center space-y-4 shadow-soft">
          <AlertTriangle className="w-10 h-10 text-status-warning mx-auto" />
          <h2 className="text-xl font-bold text-plum">Incident Not Found or Expired</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            This emergency link has expired or has already been safely resolved. For immediate safety concerns, please contact the user directly or call 112.
          </p>
          <a
            href="tel:112"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-status-emergency text-white rounded-xl text-xs font-bold"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 Helpline</span>
          </a>
        </div>
      </div>
    );
  }

  const freshness = LocationService.calculateFreshness(incident.location.capturedAt);
  const isAlreadyAck =
    acknowledged ||
    incident.deliveryAttempts.some(
      (d) => d.contactId === primaryContact.id && d.deliveryStatus === 'acknowledged'
    );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${incident.location.latitude},${incident.location.longitude}`;

  return (
    <div className="min-h-screen bg-ivory-warm py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Urgent Emergency Alert Header */}
        <div className="bg-status-emergency text-white p-6 rounded-3xl shadow-elevated space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              Push Protect Emergency Alert
            </span>
            <span className="text-xs font-mono opacity-90">#{incident.incidentId}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {incident.userName} triggered an SOS
          </h1>

          <p className="text-xs sm:text-sm text-rose-blush/90 leading-relaxed">
            You are receiving this alert because you are registered as a primary trusted contact. Please acknowledge receipt and review the verified location below.
          </p>

          {/* Big 1-Click Acknowledge Button */}
          <div className="pt-2">
            {!isAlreadyAck ? (
              <button
                onClick={handleAcknowledge}
                className="w-full py-3.5 px-6 bg-white text-status-emergency font-extrabold text-sm rounded-2xl shadow-elevated hover:bg-rose-blush transition-transform active:scale-98 flex items-center justify-center space-x-2 animate-bounce"
              >
                <CheckCircle2 className="w-5 h-5 text-status-emergency" />
                <span>TAP TO ACKNOWLEDGE &amp; NOTIFY {incident.userName.toUpperCase()}</span>
              </button>
            ) : (
              <div className="p-3 bg-white/20 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>You have acknowledged this alert. {incident.userName} has been notified.</span>
              </div>
            )}
          </div>
        </div>

        {/* Rapid Contact & Navigation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${incident.userPhone}`}
            className="p-4 bg-white rounded-2xl border border-border-subtle shadow-soft flex items-center space-x-3 hover:border-berry transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-berry/10 text-berry flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-text-secondary block">Direct Voice Call</span>
              <span className="text-sm font-bold text-plum">Call {incident.userName}</span>
              <span className="text-[11px] text-text-secondary block font-mono">{incident.userPhone}</span>
            </div>
          </a>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white rounded-2xl border border-border-subtle shadow-soft flex items-center space-x-3 hover:border-plum transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-plum/10 text-plum flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-text-secondary block">Live Navigation</span>
              <span className="text-sm font-bold text-plum">Directions to Coordinates</span>
              <span className="text-[11px] text-text-secondary flex items-center space-x-1">
                <span>Open Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        </div>

        {/* Verified Location Telemetry & Map */}
        <div className="bg-white rounded-3xl border border-border-subtle p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-plum" />
              <h3 className="text-sm font-bold text-plum">Permitted Location Coordinates</h3>
            </div>
            <span className="text-xs font-bold text-status-success bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {freshness.label}
            </span>
          </div>

          <LiveMap
            location={incident.location}
            isEmergency={true}
            height="320px"
          />

          <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary pt-1">
            <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle/60">
              <span className="block font-semibold text-text-secondary mb-0.5">Horizontal Accuracy</span>
              <span className="text-sm font-bold text-plum">±{incident.location.accuracyMeters} meters</span>
            </div>
            <div className="p-3 bg-ivory-warm rounded-xl border border-border-subtle/60">
              <span className="block font-semibold text-text-secondary mb-0.5">Time of Activation</span>
              <span className="text-sm font-bold text-plum">
                {new Date(incident.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* 112 Official Helpline Reminder */}
        <div className="p-5 rounded-2xl bg-berry/10 border border-berry/20 text-xs text-text-primary flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-status-emergency flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-plum block">Unable to reach the wearer or suspect danger?</span>
            <p className="text-text-secondary leading-relaxed">
              Do not hesitate to immediately contact official emergency services in India by dialling{' '}
              <a href="tel:112" className="font-bold text-status-emergency underline">
                112 (National Emergency Helpline)
              </a>
              . Provide them with the GPS coordinates and address listed above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
