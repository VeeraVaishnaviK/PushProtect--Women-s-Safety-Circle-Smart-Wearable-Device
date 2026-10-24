import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JourneyDocument } from '../schemas/domain.schemas';

@ApiTags('Safe Journey Automated Escort')
@Controller('api/v1/journeys')
export class JourneysController {
  private activeJourneys: Map<string, JourneyDocument> = new Map();

  @Post()
  @ApiOperation({ summary: 'Initiate a new escorted Safe Journey with check-in schedule' })
  startJourney(@Body() body: any): JourneyDocument {
    const id = 'sj-' + Date.now();
    const now = new Date();
    const duration = body.expectedArrivalMinutes || 30;
    const interval = body.checkInIntervalMinutes || 10;

    const journey: JourneyDocument = {
      id,
      userId: body.userId || 'usr-101',
      origin: body.origin || 'Current Location',
      destination: body.destination || 'Home Residence',
      expectedArrivalTime: new Date(now.getTime() + duration * 60000).toISOString(),
      checkInIntervalMinutes: interval,
      status: 'active',
      startedAt: now.toISOString(),
      lastCheckInAt: now.toISOString(),
      nextCheckInDueAt: new Date(now.getTime() + interval * 60000).toISOString(),
    };

    this.activeJourneys.set(id, journey);
    return journey;
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'User confirms safe arrival or routine check-in milestone' })
  checkIn(@Param('id') id: string): JourneyDocument {
    const journey = this.activeJourneys.get(id);
    if (!journey) {
      throw new Error(`Journey ${id} not found`);
    }

    const now = new Date();
    journey.lastCheckInAt = now.toISOString();
    journey.nextCheckInDueAt = new Date(now.getTime() + journey.checkInIntervalMinutes * 60000).toISOString();
    journey.status = 'active';

    return journey;
  }
}
