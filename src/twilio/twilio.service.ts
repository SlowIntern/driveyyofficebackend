import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';


@Injectable()
export class TwilioService {
    private readonly logger = new Logger(TwilioService.name);
    private client:Twilio
    constructor() { 
        this.client = new Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
    }

    async sendMessage(to: string, message: string):Promise<void>
    {
        try {
            const response = await this.client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
            });

            this.logger.log(`Sms Sent to ${to} : SID = ${response.sid}`);
        } catch (error)
        {
                 this.logger.error(`Failed to send SMS: ${error.message}`);
                 throw error;
        }
    
    }
    


}


