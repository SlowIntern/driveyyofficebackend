import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema({
    timestamps: true,

})
export class ServiceArea extends Document {
    @Prop({
        required: true,
        trim: true,
    })
    name: string;

    @Prop({
        type: [
            {
                lat: { type: Number, required: true },
                lng: { type: Number, required: true },
            },
        ],
        // required: true,
        // _id: false,
    })
    coordinates: {
        lat: number;
        lng: number;
    }[];

    @Prop({
        default: true,
    })
    isActive: boolean;

    @Prop({
        default: null,
    })
    createdBy?: string;
}

export const ServiceAreaSchema = SchemaFactory.createForClass(ServiceArea);
