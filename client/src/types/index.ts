export type IncidentStatus =
  | 'triggered'
  | 'incident_created'
  | 'dispatching'
  | 'acknowledged'
  | 'escalating'
  | 'unconfirmed'
  | 'resolved'
  | 'cancelled';

export type DeliveryStatus =
  | 'pending'
  | 'accepted'
  | 'delivered'
  | 'unconfirmed'
  | 'acknowledged'
  | 'failed';

export interface LocationSnapshot {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  capturedAt: string; // ISO String
  source: 'gps' | 'network' | 'cached' | 'simulated';
  address?: string;
}

export interface ContactDeliveryAttempt {
  contactId: string;
  contactName: string;
  contactPhone: string;
  relationship: string;
  channel: 'sms' | 'push' | 'automated_call';
  attemptNumber: number;
  providerReference?: string;
  deliveryStatus: DeliveryStatus;
  attemptedAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
}

export interface AuditEvent {
  id: string;
  incidentId: string;
  timestamp: string;
  action: string;
  actor: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface Incident {
  id: string;
  incidentId: string;
  userId: string;
  userName: string;
  userPhone: string;
  source: 'wearable_button' | 'app_sos' | 'practice_drill' | 'safe_journey_timeout';
  deviceId?: string;
  eventId: string;
  status: IncidentStatus;
  location: LocationSnapshot;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes?: string;
  deliveryAttempts: ContactDeliveryAttempt[];
  timeline: AuditEvent[];
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  escalationPriority: 1 | 2 | 3;
  verified: boolean;
  invitationStatus: 'accepted' | 'pending' | 'revoked';
  notificationPreferences: {
    sms: boolean;
    push: boolean;
    calls: boolean;
  };
  consentTimestamps?: {
    invitedAt: string;
    acceptedAt?: string;
  };
}

export interface WearableDevice {
  id: string;
  name: string;
  deviceIdentifier: string;
  macAddress?: string;
  pairingStatus: 'connected' | 'connecting' | 'disconnected' | 'unpaired';
  batteryLevel?: number; // 0 - 100
  firmwareVersion: string;
  lastSeenAt: string;
  hardwareModel: string;
  isSimulated?: boolean;
}

export interface ResponseConfidenceEnvelopeData {
  freshnessSeconds: number;
  freshnessCategory: 'fresh' | 'moderate' | 'stale';
  accuracyMeters: number;
  accuracyCategory: 'high' | 'medium' | 'degraded';
  deliveryState: 'accepted' | 'delivered' | 'unconfirmed' | 'pending';
  deliveryLabel: string;
  contactsTotal: number;
  contactsAcknowledged: number;
  wearableConnected: boolean;
  networkAvailable: boolean;
  summaryExplanation: string;
}

export interface SafeJourney {
  id: string;
  origin: string;
  destination: string;
  expectedArrivalTime: string; // ISO
  checkInIntervalMinutes: number;
  status: 'idle' | 'active' | 'missed_checkin' | 'escalated' | 'completed';
  lastCheckInAt?: string;
  nextCheckInDueAt?: string;
  startedAt?: string;
  checkInCount?: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  phone: string;
  email: string;
  emergencyMedicalInfo?: string;
  onboardingCompleted: boolean;
}
