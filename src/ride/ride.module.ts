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
import { StripeService } from 'src/stripe/stripe.service';
import { BankModule } from 'src/bank/bank.module';
import { RazorpayService } from 'src/razorpay/razorpay.service';
import { RazorpayModule } from 'src/razorpay/razorpay.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]), MapModule, CaptainModule, UserModule
  ,AuthModule,BankModule,RazorpayModule],
  controllers: [RideController],
  providers: [RideService, JwtService,SendMessageGateway,StripeService,RazorpayService,MailService],
  exports:[RideService,MongooseModule]
})
export class RideModule {}

