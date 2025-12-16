import { Module } from '@nestjs/common';
import { VerifiedServiceService } from './verified-service.service';
import { VerifiedServiceController } from './verified-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Verified, VerifiedSchema } from './verifySchema/verify.Schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Captain, CaptainSchema } from 'src/captain/capschema/captain.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Verified.name, schema: VerifiedSchema },
    {name:Captain.name,schema:CaptainSchema},
  ])],
  controllers: [VerifiedServiceController],
  providers: [VerifiedServiceService, CloudinaryService],
  exports: [VerifiedServiceModule]
})
export class VerifiedServiceModule {}
