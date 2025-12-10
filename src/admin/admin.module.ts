import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { CaptainModule } from 'src/captain/captain.module';
import { RideModule } from 'src/ride/ride.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlackListEmail, BlackListEmailSchema } from './schema/blackEmail.schema';
import { Verified, VerifiedSchema } from 'src/verified-service/verifySchema/verify.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlackListEmail.name, schema: BlackListEmailSchema },
      { name: Verified.name, schema: VerifiedSchema }, 
    ]),
    UserModule,
    CaptainModule,
    RideModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
