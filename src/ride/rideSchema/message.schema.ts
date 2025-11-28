import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Ride', required: true })
    rideId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    senderId: Types.ObjectId;

    @Prop({ type: String, enum: ['user', 'captain'], required: true })
    senderRole: 'user' | 'captain';

    @Prop({ type: String, required: true })
    content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
