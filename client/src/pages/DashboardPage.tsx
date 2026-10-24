import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Compass,
  MapPin,
  RefreshCw,
  PhoneCall,
  Activity,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LocateFixed,
  Radio,
} from 'lucide-react';
import { useSafetyStore } from '../store/safetyStore';
import { SOSButton } from '../components/SOSButton';
import { WearableCard } from '../components/WearableCard';
import { LiveMap } from '../components/LiveMap';
import { ConfidenceEnvelope } from '../components/ConfidenceEnvelope';
import { LocationService } from '../services/locationService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    device,
    contacts,
    activeIncident,
    currentLocation,
    updateLocation,
    refreshLocation,
    safeJourney,
    getResponseConfidenceEnvelope,
  } = useSafetyStore();

  const [refreshingGPS, setRefreshingGPS] = useState(false);
  const [acquiringRealGPS, setAcquiringRealGPS] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const stopLiveStreamRef = useRef<(() => void) | null>(null);

  // Auto-attempt real device GPS on initial mount if not already locked to GPS
  useEffect(() => {
    let isMounted = true;
    if (typeof navigator !== 'undefined' && navigator.geolocation && currentLocation.source !== 'gps') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!isMounted) return;
          const snapshot = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: Math.round(position.coords.accuracy || 10),
            capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
            source: 'gps' as const,
            address: `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
          };
          updateLocation(snapshot);
          const addr = await LocationService.reverseGeocode(snapshot.latitude, snapshot.longitude);
          if (isMounted) {
            updateLocation({ ...snapshot, address: addr });
          }
        },
        () => {
          // Keep current fallback silently if permissions not yet granted
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
      );
    }
    return () => {
      isMounted = false;
      if (stopLiveStreamRef.current) {
        stopLiveStreamRef.current();
      }
    };
  }, []);

  const handleRefreshGPS = async () => {
    setRefreshingGPS(true);
    await refreshLocation();
    setRefreshingGPS(false);
  };

  const handleAcquireRealGPS = async () => {
    setAcquiringRealGPS(true);
    setGpsNotice(null);
    try {
      const realLoc = await LocationService.requestRealDeviceGPS();
      updateLocation(realLoc);
      setGpsNotice({
        type: 'success',
        message: `✓ Real physical GPS acquired: ${realLoc.latitude.toFixed(5)}, ${realLoc.longitude.toFixed(5)} (±${realLoc.accuracyMeters}m). Map centered.`,
      });
      setTimeout(() => setGpsNotice(null), 6000);
    } catch (err: any) {
      setGpsNotice({
        type: 'error',
        message: err.message || 'Could not acquire real device GPS.',
      });
      setTimeout(() => setGpsNotice(null), 7000);
    } finally {
      setAcquiringRealGPS(false);
    }
  };

  const toggleLiveStreaming = () => {
    if (isLiveStreaming) {
      if (stopLiveStreamRef.current) {
        stopLiveStreamRef.current();
        stopLiveStreamRef.current = null;
      }
      setIsLiveStreaming(false);
      setGpsNotice({
        type: 'success',
        message: 'Live GPS stream paused.',
      });
      setTimeout(() => setGpsNotice(null), 3000);
    } else {
      setIsLiveStreaming(true);
      const stopFn = LocationService.watchRealLocation(
        (loc) => {
          updateLocation(loc);
        },
        (err) => {
          setIsLiveStreaming(false);
          setGpsNotice({ type: 'error', message: err.message });
        }
      );
      stopLiveStreamRef.current = stopFn;
      setGpsNotice({
        type: 'success',
        message: '🟢 Live GPS Continuous Stream active: Coordinates update automatically as you move.',
      });
      setTimeout(() => setGpsNotice(null), 6000);
    }
  };

  const handleSOSTriggered = (incidentId: string) => {
    navigate(`/app/incidents/${incidentId}`);
  };

  const verifiedContacts = contacts.filter((c) => c.verified);
  const confidenceData = getResponseConfidenceEnvelope();
  const freshness = LocationService.calculateFreshness(currentLocation.capturedAt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Personalized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-plum">
              Welcome back, {user.displayName}
            </h1>
            <span className="text-xs bg-rose-blush text-plum font-semibold px-2 py-0.5 rounded-full border border-border-subtle">
              Circle Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Personal Safety Hub • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* 112 Quick Helpline Action */}
        <div className="flex items-center space-x-3">
          <a
            href="tel:112"
            className="flex items-center space-x-2 px-3.5 py-2 bg-status-emergency/10 hover:bg-status-emergency/20 text-status-emergency border border-status-emergency/30 rounded-xl text-xs font-bold transition-colors"
            title="Immediate direct dial to India National Emergency Response"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 112 Emergency</span>
          </a>
        </div>
      </div>

      {/* Active Incident Urgent Banner */}
      {activeIncident && (
        <div className="p-4 rounded-2xl bg-status-emergency text-white shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-blush">
                EMERGENCY ALERT BROADCAST IN PROGRESS
              </div>
              <h3 className="text-sm font-bold text-white">
                Incident #{activeIncident.incidentId} • {activeIncident.status.replace('_', ' ').toUpperCase()}
              </h3>
            </div>
          </div>
          <Link
            to={`/app/incidents/${activeIncident.incidentId}`}
            className="w-full sm:w-auto px-5 py-2 bg-white text-status-emergency font-bold text-xs rounded-xl hover:bg-rose-blush transition-colors text-center"
          >
            Open Live Incident Command Center →
          </Link>
        </div>
      )}

      {/* Main Grid Layout: Mobile-first thumb-friendly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Primary SOS & Real-time Location (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prominent SOS Activation Center */}
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-soft text-center relative overflow-hidden">
            <div className="absolute top-3 left-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary block">
                Safety Control
              </span>
              <span className="text-xs font-semibold text-plum">
                {activeIncident ? 'SOS Broadcast Active' : 'Arm Dispatched Response'}
              </span>
            </div>

            <div className="pt-6 pb-2">
              <SOSButton onTriggered={handleSOSTriggered} />
            </div>

            <div className="pt-2 flex items-center justify-center space-x-4 text-[11px] text-text-secondary border-t border-border-subtle/60 mt-4">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                <span>Encrypted Signal</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                <span>Zero False Police Dispatch</span>
              </span>
            </div>
          </div>

          {/* Location Snapshot Card with Map */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border-subtle/80 gap-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-plum" />
                <h3 className="text-sm font-bold text-plum">Current Location Snapshot</h3>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 ${
                    currentLocation.source === 'gps'
                      ? 'bg-emerald-50 text-status-success border border-emerald-200'
                      : 'bg-amber-50 text-status-warning border border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentLocation.source === 'gps' ? 'bg-status-success animate-ping' : 'bg-amber-400'}`}></span>
                  <span>{currentLocation.source === 'gps' ? 'Live GPS Active' : 'Simulated Fallback'}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                {/* Continuous Live GPS Stream Toggle */}
                <button
                  type="button"
                  onClick={toggleLiveStreaming}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs border ${
                    isLiveStreaming
                      ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                      : 'bg-white hover:bg-rose-blush/40 text-plum border-border-subtle'
                  }`}
                  title="Stream continuous real-time live location updates as you walk or travel"
                >
                  <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-white' : 'text-plum'}`} />
                  <span>{isLiveStreaming ? 'Live Stream: ON' : 'Stream Live GPS'}</span>
                </button>

                {/* 1-Click Button to Acquire Real Physical Device Location */}
                <button
                  type="button"
                  onClick={handleAcquireRealGPS}
                  disabled={acquiringRealGPS}
                  className="px-2.5 py-1 bg-plum text-ivory-warm rounded-xl text-xs font-semibold hover:bg-plum-800 transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                  title="Request real physical GPS latitude & longitude from device hardware"
                >
                  <LocateFixed className={`w-3.5 h-3.5 text-champagne ${acquiringRealGPS ? 'animate-spin' : ''}`} />
                  <span>{acquiringRealGPS ? 'Locking GPS...' : 'Acquire GPS Fix'}</span>
                </button>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    freshness.category === 'fresh'
                      ? 'bg-emerald-50 text-status-success border-emerald-200'
                      : freshness.category === 'moderate'
                      ? 'bg-amber-50 text-status-warning border-amber-200'
                      : 'bg-red-50 text-status-emergency border-red-200'
                  }`}
                >
                  {freshness.label}
                </span>

                <button
                  onClick={handleRefreshGPS}
                  disabled={refreshingGPS}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-plum hover:bg-rose-blush/40 transition-colors"
                  title="Update GPS coordinate"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingGPS ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* GPS Notice Banner */}
            {gpsNotice && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn ${
                  gpsNotice.type === 'success'
                    ? 'bg-emerald-50 text-status-success border border-emerald-200'
                    : 'bg-amber-50 text-status-warning border border-amber-200'
                }`}
              >
                {gpsNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{gpsNotice.message}</span>
              </div>
            )}

            <LiveMap
              location={currentLocation}
              isEmergency={Boolean(activeIncident)}
              onRefresh={handleRefreshGPS}
              height="340px"
            />
          </div>

          {/* Signature Feature: Response Confidence Envelope */}
          <ConfidenceEnvelope data={confidenceData} />
        </div>

        {/* Right Column: Hardware, Circle, Journey & Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Paired Wearable Hardware Card */}
          <WearableCard />

          {/* Trusted Circle Summary Card */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-berry" />
                <h3 className="text-sm font-bold text-plum">Trusted Circle Responders</h3>
              </div>
              <Link
                to="/app/contacts"
                className="text-xs font-semibold text-plum hover:text-berry flex items-center space-x-1"
              >
                <span>Manage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {contacts.slice(0, 3).map((contact) => (
                <div
                  key={contact.id}
                  className="p-2.5 rounded-xl bg-ivory-warm border border-border-subtle/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-blush flex items-center justify-center font-bold text-[11px] text-plum">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-plum">{contact.name}</div>
                      <div className="text-[10px] text-text-secondary">
                        {contact.relationship} • Priority {contact.escalationPriority}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-status-success bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-center">
              <span className="text-[11px] text-text-secondary">
                {verifiedContacts.length} verified responders will receive live SMS + push alerts.
              </span>
            </div>
          </div>

          {/* Safe Journey Card */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80 mb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-plum" />
                <h3 className="text-sm font-bold text-plum">Safe Journey Status</h3>
              </div>
              <Link
                to="/app/journey"
                className="text-xs font-semibold text-plum hover:text-berry flex items-center space-x-1"
              >
                <span>{safeJourney.status === 'active' ? 'View Journey' : 'Setup'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-3 rounded-xl bg-ivory-warm border border-border-subtle/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Current Status:</span>
                <span
                  className={`font-bold ${
                    safeJourney.status === 'active' ? 'text-status-success' : 'text-text-secondary'
                  }`}
                >
                  {safeJourney.status === 'active' ? 'In Transit Escort' : 'Not Active'}
                </span>
              </div>
              {safeJourney.status === 'active' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Destination:</span>
                    <span className="font-semibold text-plum">{safeJourney.destination}</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/app/journey"
                      className="w-full py-1.5 bg-plum text-ivory-warm text-xs font-bold rounded-lg block text-center"
                    >
                      Open Check-in Screen
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-text-secondary leading-relaxed pt-1">
                  Heading out late? Set your destination and check-in timer so your circle is alerted if you don't check in safely.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
              Safety Tools &amp; Testing
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/app/practice"
                className="p-3 rounded-xl bg-ivory-warm hover:bg-rose-blush/40 border border-border-subtle/80 flex flex-col justify-between transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-plum/10 text-plum flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-plum block">Practice Drill</span>
                  <span className="text-[10px] text-text-secondary">Zero-alarm test</span>
                </div>
              </Link>

              <Link
                to="/app/incidents"
                className="p-3 rounded-xl bg-ivory-warm hover:bg-rose-blush/40 border border-border-subtle/80 flex flex-col justify-between transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-plum/10 text-plum flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-plum block">Incident Log</span>
                  <span className="text-[10px] text-text-secondary">Audit history</span>
                </div>
              </Link>

              <Link
                to="/app/privacy"
                className="p-3 rounded-xl bg-ivory-warm hover:bg-rose-blush/40 border border-border-subtle/80 flex flex-col justify-between transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-plum/10 text-plum flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-plum block">Privacy Rules</span>
                  <span className="text-[10px] text-text-secondary">Retention policies</span>
                </div>
              </Link>

              <Link
                to="/app/device"
                className="p-3 rounded-xl bg-ivory-warm hover:bg-rose-blush/40 border border-border-subtle/80 flex flex-col justify-between transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-plum/10 text-plum flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-plum block">BLE Diagnostics</span>
                  <span className="text-[10px] text-text-secondary">Signal latency</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
