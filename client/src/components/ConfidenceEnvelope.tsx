import React from 'react';
import { Clock, Navigation, CheckCircle2, AlertCircle, Wifi, Bluetooth, Info, ShieldCheck } from 'lucide-react';
import { ResponseConfidenceEnvelopeData } from '../types';

interface ConfidenceEnvelopeProps {
  data: ResponseConfidenceEnvelopeData;
  compact?: boolean;
}

export const ConfidenceEnvelope: React.FC<ConfidenceEnvelopeProps> = ({ data, compact = false }) => {
  const getFreshnessBadge = (cat: 'fresh' | 'moderate' | 'stale') => {
    switch (cat) {
      case 'fresh':
        return { color: 'bg-emerald-50 text-status-success border-emerald-200', text: 'Live GPS (<45s)' };
      case 'moderate':
        return { color: 'bg-amber-50 text-status-warning border-amber-200', text: 'Moderate (<3m)' };
      case 'stale':
        return { color: 'bg-red-50 text-status-emergency border-red-200', text: 'Stale (>3m)' };
    }
  };

  const getAccuracyBadge = (cat: 'high' | 'medium' | 'degraded') => {
    switch (cat) {
      case 'high':
        return { color: 'bg-emerald-50 text-status-success border-emerald-200', text: 'High Precision' };
      case 'medium':
        return { color: 'bg-amber-50 text-status-warning border-amber-200', text: 'Acceptable Area' };
      case 'degraded':
        return { color: 'bg-red-50 text-status-emergency border-red-200', text: 'Degraded / Cell Tower' };
    }
  };

  const freshnessBadge = getFreshnessBadge(data.freshnessCategory);
  const accuracyBadge = getAccuracyBadge(data.accuracyCategory);

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-plum/10 flex items-center justify-center text-plum">
            <ShieldCheck className="w-5 h-5 text-plum" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-plum tracking-tight flex items-center space-x-1.5">
              <span>Response Confidence Envelope</span>
              <span className="text-[10px] font-semibold uppercase bg-champagne/20 text-plum px-1.5 py-0.5 rounded">
                Verified
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Deterministic 5-factor situational integrity
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-berry block">
            {data.contactsAcknowledged}/{data.contactsTotal} Circle Ack
          </span>
          <span className="text-[10px] text-text-secondary">
            {data.deliveryState === 'delivered' ? 'Receipts confirmed' : 'Network in-flight'}
          </span>
        </div>
      </div>

      {/* 5 Deterministic Dimensions Grid */}
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-5'} gap-3 mb-4`}>
        {/* 1. Location Freshness */}
        <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-text-secondary flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-plum" />
              <span>1. Freshness</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${freshnessBadge.color}`}>
              {freshnessBadge.text}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-bold text-plum">
              {data.freshnessSeconds < 60
                ? `${data.freshnessSeconds}s ago`
                : `${Math.floor(data.freshnessSeconds / 60)}m ${data.freshnessSeconds % 60}s ago`}
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">Time since device GPS fix</p>
          </div>
        </div>

        {/* 2. Reported Accuracy */}
        <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-text-secondary flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-plum" />
              <span>2. Accuracy</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${accuracyBadge.color}`}>
              {accuracyBadge.text}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-bold text-plum">
              ±{data.accuracyMeters} meters
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">Horizontal radius</p>
          </div>
        </div>

        {/* 3. Notification Delivery */}
        <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-text-secondary flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-plum" />
              <span>3. Dispatch</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                data.deliveryState === 'delivered'
                  ? 'bg-emerald-50 text-status-success border-emerald-200'
                  : 'bg-amber-50 text-status-warning border-amber-200'
              }`}
            >
              {data.deliveryState === 'delivered' ? 'Handset Receipt' : 'Provider Queued'}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-bold text-plum truncate" title={data.deliveryLabel}>
              {data.deliveryLabel}
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">Telecom verification</p>
          </div>
        </div>

        {/* 4. Contact Acknowledgement */}
        <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-text-secondary flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-plum" />
              <span>4. Circle Response</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                data.contactsAcknowledged > 0
                  ? 'bg-emerald-50 text-status-success border-emerald-200'
                  : 'bg-amber-50 text-status-warning border-amber-200'
              }`}
            >
              {data.contactsAcknowledged > 0 ? 'Active Help' : 'Pending Open'}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-bold text-plum">
              {data.contactsAcknowledged} of {data.contactsTotal} Responded
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">Explicit 1-tap confirmation</p>
          </div>
        </div>

        {/* 5. Connectivity & Hardware State */}
        <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-text-secondary flex items-center space-x-1">
              <Bluetooth className="w-3.5 h-3.5 text-plum" />
              <span>5. Telemetry</span>
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                data.wearableConnected && data.networkAvailable
                  ? 'bg-emerald-50 text-status-success border-emerald-200'
                  : 'bg-amber-50 text-status-warning border-amber-200'
              }`}
            >
              {data.wearableConnected ? 'BLE Synced' : 'Phone Only'}
            </span>
          </div>
          <div className="mt-1">
            <div className="text-sm font-bold text-plum flex items-center space-x-1">
              <span>{data.wearableConnected ? 'BLE Online' : 'BLE Disconnected'}</span>
              <span className="text-xs text-text-secondary font-normal">/</span>
              <span>{data.networkAvailable ? 'Web OK' : 'Offline'}</span>
            </div>
            <p className="text-[10px] text-text-secondary mt-0.5">Hardware &amp; uplink health</p>
          </div>
        </div>
      </div>

      {/* Human-Readable Plain Language Explanation (No fake AI probability numbers) */}
      <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-rose-blush/40 border border-border-subtle/80 text-xs text-text-primary">
        <Info className="w-4 h-4 text-berry flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-plum">Situational Assessment: </span>
          <span>{data.summaryExplanation}</span>
        </div>
      </div>
    </div>
  );
};
