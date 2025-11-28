import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) { }
  

}
