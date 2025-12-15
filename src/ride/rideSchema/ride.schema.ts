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

    // use them when i nedd to make payment in razorpay
    // @Prop()
    // paymentID?: string;

    // @Prop()
    // orderId?: string;

    // @Prop()
    // signature?: string;

    @Prop({ select: true, required: true })
    otp: string;


    // Stripe fields
    @Prop()
    stripePaymentIntentId?: string;

    @Prop()
    stripeChargeId?: string;

    @Prop()
    stripeCustomerId?: string;

    @Prop()
    stripePaymentMethodId?: string;

    @Prop()
    stripeTransferId?: string;

    @Prop({
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    })
    payoutStatus?: string;


    // razorpay
    @Prop()
    razorpayOrderId?: string;

    @Prop()
    razorpayPaymentId?: string;

    @Prop()
    payoutId?: string;

    @Prop({
        type: String,
        enum: ['return', 'simple'],
        default: 'simple',
    })
    rideType?: string;
}

export const RideSchema = SchemaFactory.createForClass(Ride);
