import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { IncidentDocument, IncidentStatus, DeliveryAttemptDto, AuditEventDto } from '../schemas/incident.schema';
import { SMSService } from './sms.service';

@Injectable()
export class IncidentsService {
  private incidents: Map<string, IncidentDocument> = new Map();
  private processedEventIds: Set<string> = new Set();

  constructor(private readonly smsService: SMSService) {
    // Seed initial mock incident for demonstration
    const seedId = 'INC-829104';
    const now = new Date(Date.now() - 3600000).toISOString();
    this.incidents.set(seedId, {
      id: seedId,
      incidentId: seedId,
      userId: 'usr-101',
      userName: 'Vaishnavi R.',
      userPhone: '+91 98765 00000',
      source: 'wearable_button',
      deviceId: 'PP-ESP32-8F92',
      eventId: 'evt-seed-1',
      status: 'resolved',
      location: {
        latitude: 13.0475,
        longitude: 80.2824,
        accuracyMeters: 14,
        capturedAt: now,
        source: 'gps',
        address: 'Near Marina Beach Road, Chennai, Tamil Nadu',
      },
      deliveryAttempts: [
        {
          contactId: 'tc-1',
          contactName: 'Ananya Sharma',
          contactPhone: '+91 98765 43210',
          relationship: 'Sister',
          channel: 'sms',
          attemptNumber: 1,
          providerReference: 'sms-gw-48201',
          deliveryStatus: 'acknowledged',
          attemptedAt: now,
          deliveredAt: new Date(Date.now() - 3590000).toISOString(),
          acknowledgedAt: new Date(Date.now() - 3550000).toISOString(),
        },
      ],
      timeline: [
        {
          id: 'tl-seed-1',
          incidentId: seedId,
          timestamp: now,
          action: 'SOS_TRIGGERED',
          actor: 'Smart Wearable Hardware',
          description: 'Wearable tactile button activated',
        },
        {
          id: 'tl-seed-2',
          incidentId: seedId,
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          action: 'INCIDENT_RESOLVED',
          actor: 'Vaishnavi R.',
          description: 'Wearer reached campus hostel safely.',
        },
      ],
      createdAt: now,
      updatedAt: new Date(Date.now() - 3500000).toISOString(),
      resolvedAt: new Date(Date.now() - 3500000).toISOString(),
      notes: 'Reached hostel safely.',
    });
  }

  // Idempotent creation: protects against replayed BLE signals and duplicate POST requests
  public createIncident(dto: {
    userId: string;
    userName: string;
    userPhone: string;
    source: string;
    deviceId?: string;
    eventId: string;
    location: {
      latitude: number;
      longitude: number;
      accuracyMeters: number;
      capturedAt: string;
      source: string;
      address?: string;
    };
    contacts: Array<{
      id: string;
      name: string;
      phone: string;
      relationship: string;
    }>;
  }): IncidentDocument {
    // Replay Protection / Idempotency Check
    if (this.processedEventIds.has(dto.eventId)) {
      // Find and return existing incident safely
      for (const inc of this.incidents.values()) {
        if (inc.eventId === dto.eventId) {
          return inc;
        }
      }
      throw new ConflictException(`Duplicate emergency event detected: ${dto.eventId}`);
    }

    this.processedEventIds.add(dto.eventId);

    const incidentId = 'INC-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toISOString();

    const deliveryAttempts: DeliveryAttemptDto[] = (dto.contacts || []).map((c, i) => ({
      contactId: c.id,
      contactName: c.name,
      contactPhone: c.phone,
      relationship: c.relationship,
      channel: i === 0 ? 'sms' : 'push',
      attemptNumber: 1,
      providerReference: 'sms-gw-' + Math.floor(10000 + Math.random() * 90000),
      deliveryStatus: 'accepted',
      attemptedAt: now,
    }));

    const timeline: AuditEventDto[] = [
      {
        id: 'tl-' + Date.now() + '-1',
        incidentId,
        timestamp: now,
        action: 'SOS_TRIGGERED',
        actor: dto.source === 'wearable_button' ? 'Smart Wearable Hardware' : 'Mobile Application',
        description: `SOS activated via ${dto.source}. Event ID: ${dto.eventId}`,
      },
      {
        id: 'tl-' + Date.now() + '-2',
        incidentId,
        timestamp: now,
        action: 'INCIDENT_CREATED',
        actor: 'Push Protect Core API',
        description: `Incident ${incidentId} registered. Location locked ±${dto.location.accuracyMeters}m.`,
      },
      {
        id: 'tl-' + Date.now() + '-3',
        incidentId,
        timestamp: new Date(Date.now() + 200).toISOString(),
        action: 'DISPATCHING_NOTIFICATIONS',
        actor: 'Telecom Notification Gateway',
        description: `Alerts dispatched to ${deliveryAttempts.length} trusted responders in order of priority.`,
      },
    ];

    const incident: IncidentDocument = {
      id: incidentId,
      incidentId,
      userId: dto.userId,
      userName: dto.userName,
      userPhone: dto.userPhone,
      source: dto.source,
      deviceId: dto.deviceId,
      eventId: dto.eventId,
      status: 'incident_created',
      location: dto.location,
      deliveryAttempts,
      timeline,
      createdAt: now,
      updatedAt: now,
    };

    this.incidents.set(incidentId, incident);

    // Asynchronously dispatch SMS alerts to contacts
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    for (const c of dto.contacts || []) {
      const responseUrl = `${frontendUrl}/respond/incidents/${incidentId}`;
      this.smsService
        .sendEmergencyAlert({
          to: c.phone,
          userName: dto.userName,
          incidentId,
          responseUrl,
          locationAddress: dto.location.address,
        })
        .then((res) => {
          if (res.success) {
            const attempt = incident.deliveryAttempts.find((d) => d.contactId === c.id);
            if (attempt) {
              attempt.deliveryStatus = 'delivered';
              attempt.deliveredAt = new Date().toISOString();
              attempt.providerReference = res.messageId;
            }
          }
        })
        .catch(() => {});
    }

    return incident;
  }

  public getIncidents(userId?: string): IncidentDocument[] {
    const list = Array.from(this.incidents.values());
    if (userId) {
      return list.filter((i) => i.userId === userId);
    }
    return list;
  }

  public getIncidentById(incidentId: string): IncidentDocument {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new NotFoundException(`Incident ${incidentId} not found`);
    }
    return incident;
  }

  public acknowledgeIncident(incidentId: string, contactId: string): IncidentDocument {
    const incident = this.getIncidentById(incidentId);
    const now = new Date().toISOString();

    let responderName = 'Trusted Contact';
    incident.deliveryAttempts = incident.deliveryAttempts.map((att) => {
      if (att.contactId === contactId) {
        responderName = att.contactName;
        return {
          ...att,
          deliveryStatus: 'acknowledged',
          acknowledgedAt: now,
        };
      }
      return att;
    });

    incident.status = 'acknowledged';
    incident.updatedAt = now;
    incident.timeline.push({
      id: 'tl-ack-' + Date.now(),
      incidentId,
      timestamp: now,
      action: 'CONTACT_ACKNOWLEDGED',
      actor: responderName,
      description: `${responderName} acknowledged emergency alert and opened the response viewer.`,
    });

    return incident;
  }

  public updateLocation(incidentId: string, location: any): IncidentDocument {
    const incident = this.getIncidentById(incidentId);
    const now = new Date().toISOString();
    incident.location = location;
    incident.updatedAt = now;
    incident.timeline.push({
      id: 'tl-loc-' + Date.now(),
      incidentId,
      timestamp: now,
      action: 'LOCATION_UPDATED',
      actor: 'Device GPS Telemetry',
      description: `Fine location fix locked: ±${location.accuracyMeters}m radius.`,
    });
    return incident;
  }

  public cancelIncident(incidentId: string): IncidentDocument {
    const incident = this.getIncidentById(incidentId);
    const now = new Date().toISOString();
    incident.status = 'cancelled';
    incident.resolvedAt = now;
    incident.updatedAt = now;
    incident.timeline.push({
      id: 'tl-cancel-' + Date.now(),
      incidentId,
      timestamp: now,
      action: 'INCIDENT_CANCELLED',
      actor: incident.userName,
      description: 'Incident safely cancelled by user (false alarm confirmed).',
    });
    return incident;
  }

  public resolveIncident(incidentId: string, notes?: string): IncidentDocument {
    const incident = this.getIncidentById(incidentId);
    const now = new Date().toISOString();
    incident.status = 'resolved';
    incident.resolvedAt = now;
    incident.updatedAt = now;
    incident.notes = notes || 'Incident resolved. Wearer confirmed safe.';
    incident.timeline.push({
      id: 'tl-resolve-' + Date.now(),
      incidentId,
      timestamp: now,
      action: 'INCIDENT_RESOLVED',
      actor: incident.userName,
      description: incident.notes,
    });
    return incident;
  }
}
