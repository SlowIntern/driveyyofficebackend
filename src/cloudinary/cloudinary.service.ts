import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import * as streamifier from 'streamifier';


@Injectable()
export class CloudinaryService {
    constructor() { }
    
    uploadFile(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: "VerificationDocs",
                    resource_type: "auto", // images + pdf supported
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }
}
