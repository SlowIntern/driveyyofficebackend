import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Ride } from "src/ride/rideSchema/ride.schema";


@Schema({ timestamps: true})
export class ReturnTrips extends Document {

    @Prop({ type: Types.ObjectId, ref: 'Ride', required: true })
    rideId: Ride;

    @Prop({ required: true })
    price: number;
    
    @Prop()
    pickup: string;


    @Prop()
    destination: string;

    @Prop({
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',})
    status: string;




    // Note the time 
    @Prop()
    waitingTime: number;


}



export const ReturnTripSchema = SchemaFactory.createForClass(ReturnTrips);