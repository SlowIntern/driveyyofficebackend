import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { VerifiedServiceService } from './verified-service.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('verified-service')
export class VerifiedServiceController {
  constructor(private readonly verifiedService: VerifiedServiceService) { }
  
  @Post("upload")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "aadhaarFront", maxCount: 1 },
      { name: "aadhaarBack", maxCount: 1 },
      { name: "panCard", maxCount: 1 },
      { name: "licenseFront", maxCount: 1 },
      { name: "licenseBack", maxCount: 1 },
      { name: "rcFront", maxCount: 1 },
      { name: "rcBack", maxCount: 1 },
      { name: "profilePhoto", maxCount: 1 },
    ])
  )
  upload(
    @UploadedFiles() files: any,
    @Body() body: any,
  ) {
    return this.verifiedService.uploadDocuments(files, body);
  }
}
