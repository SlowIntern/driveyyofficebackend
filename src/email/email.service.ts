import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
@Injectable()
export class EmailService {
    private readonly emailTransport;
    constructor() {
        this.emailTransport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Method to send OTP via email using Nodemailer
    async sendOtpToEmail(email: string): Promise<string> {
        const otp ='3245';

        try {
           
            await this.emailTransport.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP is ${otp}`,
                html: `<p>Your OTP is <strong>${otp}</strong></p>`,
            });

            return otp; 
        } catch (error) {
            console.error('Error sending OTP via email', error);
            throw new Error('Failed to send OTP via email');
        }
    }

}
