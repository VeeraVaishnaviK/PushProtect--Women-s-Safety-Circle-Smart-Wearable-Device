import { IncidentDocument } from '../schemas/incident.schema';
export declare class IncidentsService {
    private incidents;
    private processedEventIds;
    constructor();
    createIncident(dto: {
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
    }): IncidentDocument;
    getIncidents(userId?: string): IncidentDocument[];
    getIncidentById(incidentId: string): IncidentDocument;
    acknowledgeIncident(incidentId: string, contactId: string): IncidentDocument;
    updateLocation(incidentId: string, location: any): IncidentDocument;
    cancelIncident(incidentId: string): IncidentDocument;
    resolveIncident(incidentId: string, notes?: string): IncidentDocument;
}
