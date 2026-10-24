import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { DevicesController } from './controllers/devices.controller';
import { ContactsController } from './controllers/contacts.controller';
import { IncidentsController } from './controllers/incidents.controller';
import { JourneysController } from './controllers/journeys.controller';
import { IncidentsService } from './services/incidents.service';
import { SMSService } from './services/sms.service';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [],
  controllers: [
    AuthController,
    DevicesController,
    ContactsController,
    IncidentsController,
    JourneysController,
  ],
  providers: [IncidentsService, SMSService, EventsGateway],
})
export class AppModule {}
