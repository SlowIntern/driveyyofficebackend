import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ride, RideSchema } from './rideSchema/ride.schema';

import { MapModule } from 'src/map/map.module';
import { CaptainModule } from 'src/captain/captain.module';
import { UserModule } from 'src/user/user.module';
import { SendmessageModule } from 'src/sendmessage/sendmessage.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { Mongoose } from 'mongoose';
import { SendMessageGateway } from 'src/sendmessage/sendmessage.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]), MapModule, CaptainModule, UserModule
  ,AuthModule],
  controllers: [RideController],
  providers: [RideService, JwtService,SendMessageGateway],
  exports:[RideService,MongooseModule]
})
export class RideModule {}

