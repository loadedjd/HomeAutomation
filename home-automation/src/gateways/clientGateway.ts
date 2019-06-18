import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Config } from '../models/Config';
import { Socket } from 'socket.io';
import { SocketService } from '../services/SocketService';
import { Data } from '../models/Data';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class ClientGateway {

  //constructor(private readonly _socketService: SocketService) { }

  @SubscribeMessage('register')
  handleRegister(client: Socket, payload: Config): string {
    SocketService.addRegisteredClient(client, payload);
    return 'ok';
  }

  @SubscribeMessage('data')
  handleData(client: Socket, payload: Data): string {
    SocketService.addNewData(payload, client);
    return 'ok';
  }

  @SubscribeMessage('close')
  handleClose(client: Socket, id: string): string {
    SocketService.removeRegisteredClient(id);
    return 'ok';
  }

  @SubscribeMessage('ack')
  handleAck(client: Socket, payload: any) {
    Logger.log('New Ack Received');
  }
}
