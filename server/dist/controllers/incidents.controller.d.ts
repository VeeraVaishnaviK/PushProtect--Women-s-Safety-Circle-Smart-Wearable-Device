import { IncidentsService } from '../services/incidents.service';
import { IncidentDocument } from '../schemas/incident.schema';
export declare class IncidentsController {
    private readonly incidentsService;
    constructor(incidentsService: IncidentsService);
    createIncident(body: any): IncidentDocument;
    getIncidents(): IncidentDocument[];
    getIncidentById(id: string): IncidentDocument;
    getIncidentTimeline(id: string): import("../schemas/incident.schema").AuditEventDto[];
    acknowledgeIncident(id: string, body: {
        contactId: string;
    }): IncidentDocument;
    updateLocation(id: string, body: any): IncidentDocument;
    cancelIncident(id: string): IncidentDocument;
    resolveIncident(id: string, body: {
        notes?: string;
    }): IncidentDocument;
}
