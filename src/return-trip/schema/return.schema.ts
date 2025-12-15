import { Prop, Schema } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Ride } from "src/ride/rideSchema/ride.schema";


@Schema({ timestamps: true})
export class ReturnTrip extends Document {

    @Prop({ type: Types.ObjectId, ref: 'Ride', required: true })
    rideId: Ride;

    @Prop({ required: true })
    price: number;
    
    @Prop({ required: true })
    returnPickup: string;
}
