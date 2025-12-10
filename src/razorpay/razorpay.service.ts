import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
    razorpay: Razorpay;

    constructor(private configService: ConfigService) {
        const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

     //   console.log("Razorpay Key ID from env:", keyId);
      //  console.log("Razorpay Key Secret from env:", keySecret );

        if (!keyId || !keySecret) throw new Error('Razorpay keys not set');

        this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    // Create an order
    async createOrder(amount: number, currency = 'INR', receipt?: string) {
        const options = {
            amount, // in paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            payment_capture: 1, // auto capture
        };
        return this.razorpay.orders.create(options);
    }

    // Fetch payment details
    async fetchPayment(paymentId: string) {
        return this.razorpay.payments.fetch(paymentId);
    }

    // Transfer to driver (payout)
    async transferToDriver(accountId: string, amount: number, currency = 'INR') {
        try {
            const response = await (this.razorpay as any).payouts.create({
                account_number: accountId,
                amount,
                currency,
                mode: 'IMPS',
                purpose: 'payout',
            });

            console.log("PAYOUT SUCCESS:", response);
            return response;
        } catch (error) {
            console.error("PAYOUT ERROR:", error);
            throw error;
        }
    }

}
