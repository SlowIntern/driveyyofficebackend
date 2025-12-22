import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verified } from './verifySchema/verify.Schema';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Captain } from 'src/captain/capschema/captain.schema';



@Injectable()
export class VerifiedServiceService {

    constructor(@InjectModel(Verified.name) private readonly verifiedModel: Model<Verified>,
        @InjectModel(Captain.name) private readonly captainModel: Model<Captain>,
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

        console.log("Document saved:", saved);
    
        return saved;
    }


    async docsAgg(user: any) {

        const ndocs=await this.verifiedModel.countDocuments({captainId:user._id.toString()});
        console.log("The number of documents found are",ndocs);



        return await this.verifiedModel.aggregate([
            {
                $match: {
                    captainId: user._id.toString(),
                },
            },
            {
                $lookup: {
                    from: 'captains',
                    let: { capId: { $toObjectId: '$captainId' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$capId'] },
                            },
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastname: 1,
                                email: 1,
                                status: 1,
                                isverified: 1,
                                totalEarnings: 1,
                            },
                        },
                    ],
                    as: 'captain',
                },
            },
            { $unwind: '$captain' },
        ]);
    }


}
