import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Authenticated connection logging
  }

  handleDisconnect(client: Socket) {
    // Client disconnect
  }

  @SubscribeMessage('join_incident_room')
  handleJoinIncident(client: Socket, incidentId: string) {
    client.join(`incident_${incidentId}`);
    return { event: 'joined_room', data: `incident_${incidentId}` };
  }

  public broadcastIncidentUpdate(incidentId: string, update: any) {
    if (this.server) {
      this.server.to(`incident_${incidentId}`).emit('incident_updated', update);
    }
  }
}
