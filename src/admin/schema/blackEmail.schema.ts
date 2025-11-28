import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class BlackListEmail extends Document
{
    @Prop({required:true})
    email: string;
}


export const BlackListEmailSchema=SchemaFactory.createForClass(BlackListEmail)