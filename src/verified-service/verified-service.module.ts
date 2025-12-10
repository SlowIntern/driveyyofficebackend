import { Module } from '@nestjs/common';
import { VerifiedServiceService } from './verified-service.service';
import { VerifiedServiceController } from './verified-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Verified, VerifiedSchema } from './verifySchema/verify.Schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Verified.name, schema: VerifiedSchema }])],
  controllers: [VerifiedServiceController],
  providers: [VerifiedServiceService, CloudinaryService],
  exports: [VerifiedServiceModule]
})
export class VerifiedServiceModule {}
