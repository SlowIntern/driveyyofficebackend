import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';


@Controller('user')
export class UserController {

    constructor(private readonly twilioService: TwilioService,
        private readonly emailService:EmailService
    ) { }
    
    @Post('sms')
    async sendMessage()
    {
        this.twilioService.sendMessage("+917876142601", "Twilio is working send otp for verification");
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req) {
        return req.user;  
    }


    @Post('email')
    async emailSender()
    {
        const email = await this.emailService.sendOtpToEmail('taara@0361gmail.com');
        return email;
    }
    
}
