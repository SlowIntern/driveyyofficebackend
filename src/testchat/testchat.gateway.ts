import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class TestchatGateway implements OnGatewayInit,OnGatewayConnection,OnGatewayDisconnect{
 
  @WebSocketServer()
  server: Server;

  private connectedUser: Set<string> = new Set();

  afterInit(server: Server) {
    console.log('websocket server intialized');
  }

  handleConnection(@ConnectedSocket() client:Socket) {
    console.log("client connected ");
  }


  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUser.delete(client.id);
    this.server.emit('users', Array.from(this.connectedUser));
  }



  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: { sender: string; content:string},@ConnectedSocket() client:Socket) {
    this.server.emit("message", message);
    console.log(message);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() username: string, @ConnectedSocket() client: Socket)
  {
    this.connectedUser.add(username);
    this.server.emit('users', Array.from(this.connectedUser));
  }
}
