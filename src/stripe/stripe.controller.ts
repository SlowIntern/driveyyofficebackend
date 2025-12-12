import { BadRequestException, Body, Controller, Header, Headers, Post, Req } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { RideService } from 'src/ride/ride.service';


@Controller('stripe')
export class StripeController {
    constructor(
        private stripeService: StripeService,
        private rideService: RideService,
    ) { }

    @Post('webhook')
   @Header('Content-Type', 'application/json')
    async handleWebhook(@Req() req: Request) {
        const signature = req.headers['stripe-signature'];
        const payload = (req as any).rawBody;

        if (!signature) throw new BadRequestException('Missing Stripe signature');

        let event;
        try {

            event = this.stripeService.constructEventFromPayload(signature as string, payload);
        } catch (err) {
            throw new BadRequestException('Invalid Stripe Webhook Signature');
        }

      
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.rideService.onPaymentSuccess(event.data.object.id);
                break;

            case 'account.updated':
                const account = event.data.object;
               // await this.rideService.updateCaptainStripeStatus(account.id, account);
                break;

            default:
                console.log('Unhandled Stripe event:', event.type);
        }

        return { received: true };
    }
   
}


// }
