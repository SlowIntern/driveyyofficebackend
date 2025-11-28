import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { StripeService } from './stripe.service';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';


@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
        return this.stripeService.createPaymentIntent(dto);
    }

        @Post('webhook')
        async handleWebhook(
            @Req() req: RawBodyRequest<Request>,
            @Headers('stripe-signature') signature: string,
        ) {
            let event;

            try {
                if (!req.rawBody) {
                    throw new Error('Missing rawBody. Ensure raw body parser is applied.');
                }

                event = this.stripeService.constructEventFromPayload(
                    signature,
                    req.rawBody,
                );
            } catch (err) {
                console.error('Webhook signature verification failed:', err.message);
                return { error: 'Webhook signature verification failed' };
            }

            // Handle specific event types
            switch (event.type) {
                case 'payment_intent.succeeded':
                    console.log(' Payment succeeded!');
                    break;
                case 'payment_intent.payment_failed':
                    console.log(' Payment failed.');
                    break;
                default:
                    console.log(`ℹUnhandled event type: ${event.type}`);
            }

            return { received: true };
        }
}


// }
