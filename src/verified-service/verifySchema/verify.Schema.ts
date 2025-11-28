import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Verified {

    @Prop({ type: Types.ObjectId, ref: "Captain", required: true })
    captainId: Types.ObjectId;

    // Aadhaar card image
    @Prop()
    aadhaarFront: string;

    @Prop()
    aadhaarBack: string;

    // PAN card image
    @Prop()
    panCard: string;

    // Driving license
    @Prop()
    licenseFront: string;

    @Prop()
    licenseBack: string;

    // Vehicle registration
    @Prop()
    rcFront: string;

    @Prop()
    rcBack: string;

    // Profile photo
    @Prop()
    profilePhoto: string;
}

export const VerifiedSchema = SchemaFactory.createForClass(Verified);
