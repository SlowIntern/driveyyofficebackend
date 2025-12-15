import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CaptainModule } from './captain/captain.module';
import { RideModule } from './ride/ride.module';
import { MapModule } from './map/map.module';
import { SendmessageModule } from './sendmessage/sendmessage.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { TwilioService } from './twilio/twilio.service';
import { EmailService } from './email/email.service';

import { AdminModule } from './admin/admin.module';

import { TestchatGateway } from './testchat/testchat.gateway';
import { TestchatService } from './testchat/testchat.service';
import { TestchatModule } from './testchat/testchat.module';
import { StripeModule } from './stripe/stripe.module';

import { UploadsModule } from './uploads/uploads.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { VerifiedServiceModule } from './verified-service/verified-service.module';
import { BankdetailsModule } from './bankdetails/bankdetails.module';
import { BankModule } from './bank/bank.module';
import { CronjobModule } from './cronjob/cronjob.module';
import { Scheduler } from 'rxjs';
import { ScheduleModule } from '@nestjs/schedule';
import { RazorpayModule } from './razorpay/razorpay.module';
import { RideScheduleModule } from './ride-schedule/ride-schedule.module';
import { RideService } from './ride/ride.service';
import { RideScheduleService } from './ride-schedule/ride-schedule.service';
import { ReturnTripModule } from './return-trip/return-trip.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/uberClone',
    ),ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CaptainModule,
    RideModule,
    MapModule,
    SendmessageModule,
    AdminModule,

    TestchatModule,

    StripeModule,

    UploadsModule,

    CloudinaryModule,

    VerifiedServiceModule,

    BankdetailsModule,

    BankModule,

    CronjobModule,

    RazorpayModule,
  ScheduleModule,
    RideScheduleModule,
    ReturnTripModule,
    MailModule,

  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService,RolesGuard,JwtService, TwilioService, EmailService, TestchatGateway, TestchatService,MailService], 
})
export class AppModule { }
