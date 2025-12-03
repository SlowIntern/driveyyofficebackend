import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum Status{
    Pending = 'pending',
    Accepted = 'accepted',
    Ongoing = 'ongoing',
    Completed = 'completed',
    Cancelled = 'cancelled',
}
@Schema({ timestamps: true })
export class RideSchedule extends Document{

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    User: Types.ObjectId;
    @Prop({type:String,required:true})
    pickup: string;
    @Prop({type:String,required:true})
    destination: string;
    @Prop({type:Date,required:true})
    date: Date;
    @Prop({type:String,required:true})
    time: string;
    @Prop({
        type: String,
        enum: Object.values(Status),
        default: Status.Pending,
    })
    status: Status;

    
    @Prop({
        type: String,
        enum: ['auto', 'car', 'moto'],
        required: true,
    })
    vehicleType: string;


}


export const RideScheduleSchema = SchemaFactory.createForClass(RideSchedule);