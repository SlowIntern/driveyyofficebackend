import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verified } from './verifySchema/verify.Schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';


@Injectable()
export class VerifiedServiceService {

    constructor(@InjectModel(Verified.name) private readonly verifiedModel: Model<Verified>,
        private cloudinaryService: CloudinaryService ){ }

    
    async uploadDocuments(files: any, body: any) {
        const uploaded: Record<string, string> = {};

        // Upload each file sent from frontend
        for (const key in files) {
            if (files[key] && files[key][0]) {
                const result = await this.cloudinaryService.uploadFile(files[key][0]);
                uploaded[key] = result.secure_url;
            }
        }

        // Save to MongoDB
        const saved = await this.verifiedModel.create({
            captainId: body.captainId,
            ...uploaded,
        });

        return saved;
    }

}
