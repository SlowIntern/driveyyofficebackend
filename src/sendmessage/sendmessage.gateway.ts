// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
// import { Server, Socket } from 'socket.io';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';

// import { User } from 'src/user/schema/user.schema';
// import { Ride } from 'src/ride/rideSchema/ride.schema';
// import { Captain } from 'src/captain/capschema/captain.schema';


// @WebSocketGateway({
//   cors: {
//     origin: ["http://localhost:3001"],  
//     credentials: true,
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   },
//   transports: ["websocket", "polling"],
// })


// export class SendMessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private readonly logger = new Logger(SendMessageGateway.name);
//   private activeSockets = new Map<string, string>(); // user/captain ID -> socketId

//   constructor(
//     @InjectModel(Ride.name) private rideModel: Model<Ride>,
//     @InjectModel(User.name) private userModel: Model<User>,
//     @InjectModel(Captain.name) private captainModel: Model<Captain>,
//   ) { }

//   handleConnection(client: Socket) {
//  //   console.log(client.id);
//     this.logger.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);

//     for (const [id, socketId] of this.activeSockets.entries()) {
//       if (socketId === client.id) {
//         this.activeSockets.delete(id);
//         break;
//       }
//     }
//   }

//   // Register a user or captain’s socket connection
   
//   @SubscribeMessage('register-socket')
//   async handleRegisterSocket(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { userId: string; role: 'user' | 'captain' },
//   ) {
//     if (!data?.userId) return;

//  //   console.log(data);
//   //  console.log(client.id);
//     this.activeSockets.set(data.userId, client.id);  // this will map user/captain Id to socket Id
//     this.logger.log(`Registered socket for ${data.role}: ${data.userId} (${client.id})`);

//     if (data.role === 'user') {
//       const user = await this.userModel.findByIdAndUpdate(
//         data.userId,
//         { socketId: client.id },
//         { new: true }
//       );
//    //  console.log("User updated:", user);
//     } else if (data.role === 'captain') {
//       const captain = await this.captainModel.findByIdAndUpdate(
//         data.userId,
//         { socketId: client.id },
//         { new: true }
//       );
//    //   console.log("Captain updated:", captain);
//     }

//     client.emit('registered', { success: true });
//   }


//   // Send an event (e.g., new-ride, ride-started) to a specific socket
   
//   sendMessageToSocketId(socketId: string, payload: { event: string; data: any }) {
//     if (!socketId) {
//       this.logger.warn('No socketId provided to sendMessageToSocketId');
//       return;
//     }
//     this.server.to(socketId).emit(payload.event, payload.data);
//   }

//   // Send chat messages between user & captain
   
//   @SubscribeMessage('send-message')
//   async handleSendMessage(
//     @MessageBody()
//     data: {
//       rideId: string;
//       fromId: string;
//       toId: string;
//       message: string;
//     },
//   ) {
//     if (!data.rideId || !data.message) return;

//     const ride = await this.rideModel.findById(data.rideId);
    
//     if (!ride) {
//       this.logger.warn(`Ride not found for message: ${data.rideId}`);
//       return;
//     }

//     const toSocketId = this.activeSockets.get(data.toId);

//     if (toSocketId) {
//       this.server.to(toSocketId).emit('receive-message', {
//         from: data.fromId,
//         rideId: data.rideId,
//         message: data.message,
//         timestamp: new Date(),
//       });
//     } else {
//       this.logger.warn(`Receiver ${data.toId} not connected`);
//     }
//   }

//   // async sendRideEvent(rideId: string, event: string, data: any) {
//   //   const ride = await this.rideModel
//   //     .findById(rideId)
//   //     .populate('user')
//   //     .populate('captain')
//   //     .lean();

//   //   if (!ride) return;

//   //   const userSocket = ride.user?.socketId;
//   //   const captainSocket = ride.captain?.socketId;

//   //   if (userSocket) this.server.to(userSocket).emit(event, data);
//   //   if (captainSocket) this.server.to(captainSocket).emit(event, data);
//   // }
// }


import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/user/schema/user.schema';
import { Ride } from 'src/ride/rideSchema/ride.schema';
import { Captain } from 'src/captain/capschema/captain.schema';

@WebSocketGateway({
  cors: {
    origin: ["http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
})
export class SendMessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SendMessageGateway.name);

  // Map user/captainId -> socketId
  private activeSockets = new Map<string, string>();

  constructor(
    @InjectModel(Ride.name) private rideModel: Model<Ride>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Captain.name) private captainModel: Model<Captain>,
  ) { }

  // -----------------------------------------------------
  //  CONNECTION EVENTS
  // -----------------------------------------------------
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // remove from activeSockets
    for (const [id, socketId] of this.activeSockets.entries()) {
      if (socketId === client.id) {
        this.activeSockets.delete(id);
        break;
      }
    }
  }

  // -----------------------------------------------------
  //  REGISTER SOCKET
  // -----------------------------------------------------
  @SubscribeMessage('register-socket')
  async handleRegisterSocket(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; role: 'user' | 'captain' },
  ) {
    if (!data?.userId) return;

    this.activeSockets.set(data.userId, client.id);
    this.logger.log(`Registered ${data.role}: ${data.userId} → ${client.id}`);

    if (data.role === 'user') {
      await this.userModel.findByIdAndUpdate(data.userId, { socketId: client.id });
    } else {
      await this.captainModel.findByIdAndUpdate(data.userId, { socketId: client.id });
    }

    client.emit('registered', { success: true });
  }

  // -----------------------------------------------------
  //  JOIN CHAT ROOM (ONE-TO-ONE CHAT)
  // -----------------------------------------------------
  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rideId: string },
  ) {
    if (!data.rideId) return;

    const roomName = `ride-${data.rideId}`;
    client.join(roomName);

    this.logger.log(`Client ${client.id} joined room ${roomName}`);

    client.emit('room-joined', { room: roomName });
  }

  // -----------------------------------------------------
  //  SEND MESSAGE IN ROOM (ONE-TO-ONE CHAT)
  // -----------------------------------------------------
  @SubscribeMessage('send-message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      rideId: string;
      fromId: string;
      message: string;
    },
  ) {
    if (!data.rideId || !data.message) return;

    const roomName = `ride-${data.rideId}`;

    this.logger.log(`Message to room ${roomName} from ${data.fromId}`);

    this.server.to(roomName).emit('receive-message', {
      rideId: data.rideId,
      from: data.fromId,
      message: data.message,
      timestamp: new Date(),
    });
  }

  // -----------------------------------------------------
  //  SEND SPECIFIC EVENT TO USER/CAPTAIN SOCKET (RIDE EVENTS)
  // -----------------------------------------------------
  sendMessageToSocketId(socketId: string, payload: { event: string; data: any }) {
    if (!socketId) {
      this.logger.warn('Missing socketId in sendMessageToSocketId');
      return;
    }

    this.server.to(socketId).emit(payload.event, payload.data);
  }
}
