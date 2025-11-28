import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }
  

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  
}
