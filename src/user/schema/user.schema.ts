// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum UserRole {
    USER = 'user',
    CAPTAIN = 'captain',
    ADMIN='admin'
}

@Schema({ timestamps: true })
export class User extends Document {

    declare _id: Types.ObjectId; 

    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ trim: true })
    lastName?: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    })
    email: string;

    @Prop({ required: true, minlength: 6 })
    password: string;

    @Prop()
    socketId?: string;

    @Prop({
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    })
    role: UserRole;

    @Prop({ type: Boolean, default: false })
    isBlocked: boolean;


    @Prop({ type: Boolean, default: false })
    isRiding: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);