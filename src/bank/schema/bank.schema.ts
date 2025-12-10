import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class BankAccount extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Captain' })
    user: Types.ObjectId

    @Prop({ type: String, default: null })
    stripe_account_id: string;   

    @Prop({ type: String, default: null })
    stripe_external_account_id: string; 

    @Prop({ type: String, default: null })
    bank_last4: string;          
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount)