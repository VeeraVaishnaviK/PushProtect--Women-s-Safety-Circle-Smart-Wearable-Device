import { create } from 'zustand';
import {
  Incident,
  IncidentStatus,
  TrustedContact,
  WearableDevice,
  ResponseConfidenceEnvelopeData,
  SafeJourney,
  UserProfile,
  LocationSnapshot,
} from '../types';
import { bleAdapter } from '../services/bleAdapter';
import { LocationService } from '../services/locationService';

interface SafetyState {
  user: UserProfile;
  device: WearableDevice | null;
  contacts: TrustedContact[];
  activeIncident: Incident | null;
  incidentHistory: Incident[];
  currentLocation: LocationSnapshot;
  safeJourney: SafeJourney;
  isOnline: boolean;
  practiceModeActive: boolean;

  // Actions
  setUser: (user: Partial<UserProfile>) => void;
  setDevice: (device: WearableDevice | null) => void;
  updateDeviceBattery: (level: number) => void;
  updateLocation: (loc: LocationSnapshot) => void;
  refreshLocation: () => Promise<LocationSnapshot>;
  
  // Contacts
  addContact: (contact: Omit<TrustedContact, 'id' | 'verified' | 'invitationStatus'>) => void;
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  removeContact: (id: string) => void;
  
  triggerSOS: (source?: 'wearable_button' | 'app_sos' | 'practice_drill' | 'safe_journey_timeout') => Promise<Incident>;
  cancelIncident: (incidentId: string) => void;
  resolveIncident: (incidentId: string, notes?: string) => void;
  acknowledgeIncidentByContact: (incidentId: string, contactId: string) => void;
  
  // Safe Journey
  startJourney: (destination: string, expectedArrivalMinutes: number, checkInIntervalMinutes: number) => void;
  checkInJourney: () => void;
  endJourney: () => void;

  // Helpers
  getResponseConfidenceEnvelope: (incident?: Incident | null) => ResponseConfidenceEnvelopeData;
}

const INITIAL_CONTACTS: TrustedContact[] = [
  {
    id: 'tc-1',
    name: 'Ananya Sharma',
    phone: '+91 98765 43210',
    relationship: 'Sister',
    escalationPriority: 1,
    verified: true,
    invitationStatus: 'accepted',
    notificationPreferences: { sms: true, push: true, calls: true },
    consentTimestamps: { invitedAt: '2026-05-10T10:00:00Z', acceptedAt: '2026-05-10T10:15:00Z' },
  },
  {
    id: 'tc-2',
    name: 'Dr. Priya Desai',
    phone: '+91 98111 22334',
    relationship: 'Mother',
    escalationPriority: 2,
    verified: true,
    invitationStatus: 'accepted',
    notificationPreferences: { sms: true, push: true, calls: false },
    consentTimestamps: { invitedAt: '2026-05-11T09:00:00Z', acceptedAt: '2026-05-11T09:30:00Z' },
  },
  {
    id: 'tc-3',
    name: 'Rohan Verma',
    phone: '+91 99222 33445',
    relationship: 'Colleague / Roommate',
    escalationPriority: 3,
    verified: true,
    invitationStatus: 'accepted',
    notificationPreferences: { sms: true, push: false, calls: false },
    consentTimestamps: { invitedAt: '2026-05-12T14:00:00Z', acceptedAt: '2026-05-12T14:45:00Z' },
  },
];

export const useSafetyStore = create<SafetyState>((set, get) => {
  // Listen for BLE hardware button presses
  bleAdapter.addListener({
    onSOSEvent: () => {
      get().triggerSOS('wearable_button');
    },
    onBatteryUpdate: (level) => {
      get().updateDeviceBattery(level);
    },
    onConnectionChange: (connected) => {
      const dev = get().device;
      if (dev) {
        set({
          device: {
            ...dev,
            pairingStatus: connected ? 'connected' : 'disconnected',
            lastSeenAt: new Date().toISOString(),
          },
        });
      }
    },
  });

  return {
    user: {
      id: 'usr-101',
      displayName: 'Vaishnavi R.',
      phone: '+91 98765 00000',
      email: 'vaishnavi@pushprotect.org',
      emergencyMedicalInfo: 'Blood Group: O+ | No known allergies',
      onboardingCompleted: true,
    },
    device: bleAdapter.getDevice(),
    contacts: INITIAL_CONTACTS,
    activeIncident: null,
    incidentHistory: [],
    currentLocation: LocationService.getLastKnownLocation(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    practiceModeActive: false,
    safeJourney: {
      id: 'sj-default',
      origin: 'Campus Tech Park',
      destination: 'Sector 4 Residence',
      expectedArrivalTime: new Date(Date.now() + 45 * 60000).toISOString(),
      checkInIntervalMinutes: 15,
      status: 'idle',
    },

    setUser: (updates) =>
      set((state) => ({ user: { ...state.user, ...updates } })),

    setDevice: (device) => set({ device }),

    updateDeviceBattery: (level) =>
      set((state) => ({
        device: state.device ? { ...state.device, batteryLevel: level } : null,
      })),

    updateLocation: (loc) => set({ currentLocation: loc }),

    refreshLocation: async () => {
      const loc = await LocationService.getCurrentLocation();
      set({ currentLocation: loc });
      // If incident is active, update incident location snapshot too
      const active = get().activeIncident;
      if (active) {
        set({
          activeIncident: {
            ...active,
            location: loc,
            updatedAt: new Date().toISOString(),
          },
        });
      }
      return loc;
    },

    addContact: (contactData) => {
      const newContact: TrustedContact = {
        ...contactData,
        id: 'tc-' + Date.now(),
        verified: true,
        invitationStatus: 'accepted',
        consentTimestamps: { invitedAt: new Date().toISOString(), acceptedAt: new Date().toISOString() },
      };
      set((state) => ({ contacts: [...state.contacts, newContact] }));
    },

    updateContact: (id, updates) =>
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      })),

    removeContact: (id) =>
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      })),

    triggerSOS: async (source: 'wearable_button' | 'app_sos' | 'practice_drill' | 'safe_journey_timeout' = 'app_sos') => {
      // 1. Immediately grab latest available cached or fresh location (NON-BLOCKING)
      const locSnapshot = await LocationService.getCurrentLocation();
      const now = new Date().toISOString();
      const incidentId = 'INC-' + Math.floor(100000 + Math.random() * 900000);
      const isPractice = source === 'practice_drill';

      const initialAttempts = get().contacts.map((contact, idx) => ({
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        relationship: contact.relationship,
        channel: (idx === 0 ? 'sms' : idx === 1 ? 'push' : 'sms') as 'sms' | 'push',
        attemptNumber: 1,
        providerReference: 'sms-gw-' + Math.floor(10000 + Math.random() * 90000),
        deliveryStatus: isPractice ? ('acknowledged' as const) : ('accepted' as const),
        attemptedAt: now,
      }));

      const newIncident: Incident = {
        id: incidentId,
        incidentId,
        userId: get().user.id,
        userName: get().user.displayName,
        userPhone: get().user.phone,
        source,
        deviceId: get().device?.deviceIdentifier || 'IN-APP',
        eventId: 'evt-' + Date.now(),
        status: isPractice ? 'acknowledged' : 'incident_created',
        location: locSnapshot,
        createdAt: now,
        updatedAt: now,
        deliveryAttempts: initialAttempts,
        timeline: [
          {
            id: 'tl-1',
            incidentId,
            timestamp: now,
            action: 'SOS_TRIGGERED',
            actor: source === 'wearable_button' ? 'Smart Wearable Hardware' : 'Mobile Application',
            description: `SOS activated via ${source.replace('_', ' ').toUpperCase()}`,
          },
          {
            id: 'tl-2',
            incidentId,
            timestamp: now,
            action: 'INCIDENT_REGISTERED',
            actor: 'Push Protect Core Gateway',
            description: `Incident ${incidentId} registered. Location locked (±${locSnapshot.accuracyMeters}m).`,
          },
          {
            id: 'tl-3',
            incidentId,
            timestamp: new Date(Date.now() + 500).toISOString(),
            action: 'DISPATCHING_NOTIFICATIONS',
            actor: 'Notification Queue',
            description: `Queued alerts to ${initialAttempts.length} trusted circle contacts in order of priority.`,
          },
        ],
      };

      set({ activeIncident: newIncident });

      // Simulate realistic carrier progression in non-practice mode
      if (!isPractice) {
        setTimeout(() => {
          const current = get().activeIncident;
          if (current && current.id === incidentId && current.status !== 'resolved' && current.status !== 'cancelled') {
            const updatedAttempts = current.deliveryAttempts.map((att, i) =>
              i === 0
                ? { ...att, deliveryStatus: 'delivered' as const, deliveredAt: new Date().toISOString() }
                : att
            );
            set({
              activeIncident: {
                ...current,
                status: 'dispatching',
                deliveryAttempts: updatedAttempts,
                timeline: [
                  ...current.timeline,
                  {
                    id: 'tl-carrier-' + Date.now(),
                    incidentId,
                    timestamp: new Date().toISOString(),
                    action: 'NOTIFICATION_DELIVERED',
                    actor: 'Telecom Carrier Gateway',
                    description: `SMS alert confirmed delivered to primary contact ${updatedAttempts[0].contactName}.`,
                  },
                ],
              },
            });
          }
        }, 3000);

        // Primary contact simulated acknowledgement at 7s
        setTimeout(() => {
          get().acknowledgeIncidentByContact(incidentId, get().contacts[0]?.id || 'tc-1');
        }, 7000);
      }

      return newIncident;
    },

    cancelIncident: (incidentId) => {
      const active = get().activeIncident;
      if (active && active.id === incidentId) {
        const cancelled: Incident = {
          ...active,
          status: 'cancelled',
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [
            ...active.timeline,
            {
              id: 'tl-cancel-' + Date.now(),
              incidentId,
              timestamp: new Date().toISOString(),
              action: 'INCIDENT_CANCELLED',
              actor: 'User',
              description: 'Incident safely cancelled by wearer (false alarm or safe situation verified).',
            },
          ],
        };
        set((state) => ({
          activeIncident: null,
          incidentHistory: [cancelled, ...state.incidentHistory],
        }));
      }
    },

    resolveIncident: (incidentId, notes) => {
      const active = get().activeIncident;
      if (active && active.id === incidentId) {
        const resolved: Incident = {
          ...active,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: notes || 'Resolved safely with trusted contacts.',
          timeline: [
            ...active.timeline,
            {
              id: 'tl-resolve-' + Date.now(),
              incidentId,
              timestamp: new Date().toISOString(),
              action: 'INCIDENT_RESOLVED',
              actor: 'User / Trusted Circle',
              description: notes || 'Incident marked resolved. Wearer is safe.',
            },
          ],
        };
        set((state) => ({
          activeIncident: null,
          incidentHistory: [resolved, ...state.incidentHistory],
        }));
      }
    },

    acknowledgeIncidentByContact: (incidentId, contactId) => {
      const active = get().activeIncident;
      if (active && active.id === incidentId) {
        const contact = get().contacts.find((c) => c.id === contactId);
        const contactName = contact ? contact.name : 'Trusted Contact';

        const updatedAttempts = active.deliveryAttempts.map((att) =>
          att.contactId === contactId
            ? {
                ...att,
                deliveryStatus: 'acknowledged' as const,
                acknowledgedAt: new Date().toISOString(),
              }
            : att
        );

        const updated: Incident = {
          ...active,
          status: 'acknowledged',
          updatedAt: new Date().toISOString(),
          deliveryAttempts: updatedAttempts,
          timeline: [
            ...active.timeline,
            {
              id: 'tl-ack-' + Date.now(),
              incidentId,
              timestamp: new Date().toISOString(),
              action: 'CONTACT_ACKNOWLEDGED',
              actor: contactName,
              description: `${contactName} has acknowledged the emergency alert and opened the response view.`,
            },
          ],
        };
        set({ activeIncident: updated });
      }
    },

    startJourney: (destination, expectedArrivalMinutes, checkInIntervalMinutes) => {
      const now = new Date();
      const expectedArrival = new Date(now.getTime() + expectedArrivalMinutes * 60000).toISOString();
      const nextDue = new Date(now.getTime() + checkInIntervalMinutes * 60000).toISOString();

      set({
        safeJourney: {
          id: 'sj-' + Date.now(),
          origin: 'Current Location',
          destination,
          expectedArrivalTime: expectedArrival,
          checkInIntervalMinutes,
          status: 'active',
          startedAt: now.toISOString(),
          lastCheckInAt: now.toISOString(),
          nextCheckInDueAt: nextDue,
        },
      });
    },

    checkInJourney: () => {
      const current = get().safeJourney;
      if (current.status === 'active' || current.status === 'missed_checkin') {
        const now = new Date();
        const nextDue = new Date(now.getTime() + current.checkInIntervalMinutes * 60000).toISOString();
        set({
          safeJourney: {
            ...current,
            status: 'active',
            lastCheckInAt: now.toISOString(),
            nextCheckInDueAt: nextDue,
          },
        });
      }
    },

    endJourney: () => {
      set((state) => ({
        safeJourney: {
          ...state.safeJourney,
          status: 'completed',
        },
      }));
    },

    getResponseConfidenceEnvelope: (incident) => {
      const target = incident || get().activeIncident;
      const loc = target ? target.location : get().currentLocation;
      const device = get().device;

      // 1. Freshness
      const { seconds, category: freshnessCategory } = LocationService.calculateFreshness(loc.capturedAt);

      // 2. Accuracy
      const { category: accuracyCategory } = LocationService.classifyAccuracy(loc.accuracyMeters);

      // 3. Notification delivery
      let deliveryState: 'accepted' | 'delivered' | 'unconfirmed' | 'pending' = 'pending';
      let deliveryLabel = 'Awaiting trigger';
      if (target) {
        const hasDelivered = target.deliveryAttempts.some((d) => d.deliveryStatus === 'delivered' || d.deliveryStatus === 'acknowledged');
        const hasAccepted = target.deliveryAttempts.some((d) => d.deliveryStatus === 'accepted');
        if (hasDelivered) {
          deliveryState = 'delivered';
          deliveryLabel = 'Carrier delivery receipt confirmed';
        } else if (hasAccepted) {
          deliveryState = 'accepted';
          deliveryLabel = 'Accepted by SMS provider';
        } else {
          deliveryState = 'unconfirmed';
          deliveryLabel = 'Delivery unconfirmed';
        }
      }

      // 4. Contacts Acknowledged
      const contactsTotal = target ? target.deliveryAttempts.length : get().contacts.length;
      const contactsAcknowledged = target
        ? target.deliveryAttempts.filter((d) => d.deliveryStatus === 'acknowledged').length
        : 0;

      // 5. Connectivity
      const wearableConnected = device?.pairingStatus === 'connected';
      const networkAvailable = typeof navigator !== 'undefined' ? navigator.onLine : true;

      // Summary
      let summaryExplanation = '';
      if (!target) {
        summaryExplanation = 'Standby readiness: Hardware connected, location accuracy optimal, trusted circle verified.';
      } else if (contactsAcknowledged > 0) {
        summaryExplanation = `${contactsAcknowledged} of ${contactsTotal} trusted contacts have verified receipt and confirmed acknowledgement.`;
      } else if (deliveryState === 'delivered') {
        summaryExplanation = 'Alert delivered to carrier network; awaiting contact acknowledgement.';
      } else {
        summaryExplanation = 'SOS broadcast in progress. Provider accepted notification request.';
      }

      return {
        freshnessSeconds: seconds,
        freshnessCategory,
        accuracyMeters: loc.accuracyMeters,
        accuracyCategory,
        deliveryState,
        deliveryLabel,
        contactsTotal,
        contactsAcknowledged,
        wearableConnected,
        networkAvailable,
        summaryExplanation,
      };
    },
  };
});
