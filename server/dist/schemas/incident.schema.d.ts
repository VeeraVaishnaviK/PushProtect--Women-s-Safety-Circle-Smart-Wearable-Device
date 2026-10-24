export type IncidentStatus = 'triggered' | 'incident_created' | 'dispatching' | 'acknowledged' | 'escalating' | 'unconfirmed' | 'resolved' | 'cancelled';
export type DeliveryStatus = 'pending' | 'accepted' | 'delivered' | 'unconfirmed' | 'acknowledged' | 'failed';
export interface LocationSnapshotDto {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    capturedAt: string;
    source: string;
    address?: string;
}
export interface DeliveryAttemptDto {
    contactId: string;
    contactName: string;
    contactPhone: string;
    relationship: string;
    channel: string;
    attemptNumber: number;
    providerReference?: string;
    deliveryStatus: DeliveryStatus;
    attemptedAt: string;
    deliveredAt?: string;
    acknowledgedAt?: string;
}
export interface AuditEventDto {
    id: string;
    incidentId: string;
    timestamp: string;
    action: string;
    actor: string;
    description: string;
    metadata?: Record<string, any>;
}
export interface IncidentDocument {
    id: string;
    incidentId: string;
    userId: string;
    userName: string;
    userPhone: string;
    source: string;
    deviceId?: string;
    eventId: string;
    status: IncidentStatus;
    location: LocationSnapshotDto;
    deliveryAttempts: DeliveryAttemptDto[];
    timeline: AuditEventDto[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
}
