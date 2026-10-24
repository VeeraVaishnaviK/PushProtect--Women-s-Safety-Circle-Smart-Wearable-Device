import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinIncident(client: Socket, incidentId: string): {
        event: string;
        data: string;
    };
    broadcastIncidentUpdate(incidentId: string, update: any): void;
}
