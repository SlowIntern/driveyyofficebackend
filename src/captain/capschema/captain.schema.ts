import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/user/schema/user.schema';


@Schema()
export class Captain extends Document {

    declare _id: Types.ObjectId; 

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
        lastname:string

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop()
    socketId?: string;

    @Prop({
        type: String,
        enum: ['active', 'inactive','offline'],
        default: 'inactive',
    })
    status: string;

    @Prop({
        type: {
            color: { type: String, required: true, minlength: 3 },
            plate: { type: String, required: true, minlength: 3 },
            capacity: { type: Number, required: true, min: 1 },
            vehicleType: {
                type: String,
                required: true,
                enum: ['car', 'motorcycle', 'auto'],
            },
        },
    })
    vehicle: {
        color: string;
        plate: string;
        capacity: number;
        vehicleType: 'car' | 'motorcycle' | 'auto';
    };

    @Prop({
        type: {
            ltd: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
        },
        default: () => ({})  
    })
    location: {
        ltd: number;
        lng: number;
    };



    @Prop({
        type:String,
        enum: Object.values(UserRole),
        default:UserRole.CAPTAIN
    })
    role: UserRole
    
    @Prop({ type: Boolean, default: false })
    isverified: boolean;


    //transfer details
    @Prop({ type: String, default: null })
    stripe_account_id: string;

    @Prop({ type: String, default: null })
    stripe_external_account_id: string;

    @Prop({ type: String, default: null })
    bank_last4: string;

    @Prop({ type: Boolean, default: false })
    isBlocked: boolean;

    @Prop({ type: Number, default: 0 })
    totalEarnings: number;
}

export const CaptainSchema = SchemaFactory.createForClass(Captain);
