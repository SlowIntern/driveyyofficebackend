import { Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VerifiedServiceService } from './verified-service.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

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



  @UseGuards(JwtAuthGuard)
  @Get('verifyCap')
  
  async verifyCap(@Req() req) {
    console.log("The user in verified service controller is", req.user);  
    return this.verifiedService.docsAgg(req.user);
  }
}
