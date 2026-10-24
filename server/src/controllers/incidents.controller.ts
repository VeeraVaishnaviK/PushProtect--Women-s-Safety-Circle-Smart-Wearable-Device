import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IncidentsService } from '../services/incidents.service';
import { IncidentDocument } from '../schemas/incident.schema';

@ApiTags('Emergency Incidents')
@Controller('api/v1/incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Trigger new SOS emergency incident (Idempotent)' })
  @ApiResponse({ status: 201, description: 'Emergency incident registered and queued' })
  @ApiResponse({ status: 409, description: 'Duplicate event ID rejected (Replay protection)' })
  createIncident(@Body() body: any): IncidentDocument {
    return this.incidentsService.createIncident(body);
  }

  @Get()
  @ApiOperation({ summary: 'List emergency incident records' })
  getIncidents(): IncidentDocument[] {
    return this.incidentsService.getIncidents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get active incident details by ID' })
  @ApiParam({ name: 'id', description: 'Incident ID, e.g. INC-102948' })
  getIncidentById(@Param('id') id: string): IncidentDocument {
    return this.incidentsService.getIncidentById(id);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Get chronological audit timeline of an incident' })
  getIncidentTimeline(@Param('id') id: string) {
    const inc = this.incidentsService.getIncidentById(id);
    return inc.timeline;
  }

  @Post(':id/acknowledgements')
  @ApiOperation({ summary: 'Trusted contact confirms acknowledgement of emergency alert' })
  acknowledgeIncident(@Param('id') id: string, @Body() body: { contactId: string }): IncidentDocument {
    return this.incidentsService.acknowledgeIncident(id, body.contactId);
  }

  @Post(':id/locations')
  @ApiOperation({ summary: 'Push refined GPS coordinates to an active incident' })
  updateLocation(@Param('id') id: string, @Body() body: any): IncidentDocument {
    return this.incidentsService.updateLocation(id, body);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel false alarm incident' })
  cancelIncident(@Param('id') id: string): IncidentDocument {
    return this.incidentsService.cancelIncident(id);
  }

  @Post(':id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resolve incident safely with optional confirmation note' })
  resolveIncident(@Param('id') id: string, @Body() body: { notes?: string }): IncidentDocument {
    return this.incidentsService.resolveIncident(id, body.notes);
  }
}
