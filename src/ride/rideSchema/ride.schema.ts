import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Captain } from 'src/captain/capschema/captain.schema';

@Schema({ timestamps: true }) 
export class Ride extends Document {

    declare _id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Captain' })
    captain: Captain;

    @Prop({ required: true })
    pickup: string;

    @Prop({ required: true })
    destination: string;

    @Prop({ required: true })
    fare: number;

    @Prop({
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Prop()
    duration?: number; 

    @Prop()
    distance?: number; 

    @Prop()
    paymentID?: string;

    @Prop()
    orderId?: string;

    @Prop()
    signature?: string;

    @Prop({ select: false, required: true })
    otp: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
