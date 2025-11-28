import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlackListToken extends Document {
    @Prop({ required: true })
    token: string;
}

export const BlackListTokenSchema = SchemaFactory.createForClass(BlackListToken);
