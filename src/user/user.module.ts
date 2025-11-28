import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TwilioService } from 'src/twilio/twilio.service';
import { EmailService } from 'src/email/email.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [UserService,TwilioService,EmailService],
    controllers: [UserController],
    exports: [UserService,MongooseModule],
})
export class UserModule { }


