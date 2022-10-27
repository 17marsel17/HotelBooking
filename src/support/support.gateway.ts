import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SupportRequestGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribeToChat')
  subscribe(@MessageBody() chatId: string, @ConnectedSocket() client: Socket) {
    client.join(chatId);

    this.server.to(chatId).emit('server', `Подписка на чат - ${chatId}`);
  }

  sendMessage(supportRequest: any, message: any) {
    const chatId = supportRequest._id || '';

    if (this.server.sockets.adapter.rooms.get(chatId)) {
      this.server.to(chatId).emit('server', JSON.stringify(message));
    }
  }
}
