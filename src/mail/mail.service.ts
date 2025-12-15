import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) { }

    async sendRideConfirmation(data: {
        email: string;
        firstName: string;
        pickup: string;
        destination: string;
        fare: number;
        otp: string;
    }) {
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'Ride Confirmed 🚗',
            template: 'ride-confirmation',
            context: {
                name: data.firstName,
                pickup: data.pickup,
                destination: data.destination,
                fare: data.fare,
                otp: data.otp,
            },
        });
    }

}
