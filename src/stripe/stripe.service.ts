import { Injectable } from '@nestjs/common';
import { CreatePaymentIntentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { BankAccount } from 'src/bank/schema/bank.schema';
import { Model } from 'mongoose';
import { Captain } from 'src/captain/capschema/captain.schema';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService,
        @InjectModel(BankAccount.name) private bankModel: Model<BankAccount>, 
        @InjectModel(Captain.name) private captainModel: Model<Captain>,
    ) {
        const secretKey = this.configService.get<string>('STRIPE_KEY');

        if (!secretKey) {
            throw new Error("STRIPE_KEY is missing in environment variables");
        }

        
        this.stripe = new Stripe(secretKey);
    }

    async createPaymentIntent(dto: CreatePaymentIntentDto) {
        return this.stripe.paymentIntents.create({
            amount: dto.amount,
            currency: dto.currency,
            payment_method_types: ['card'],
        });
    }

    async createDriverAccount(captain:Captain) {
        const account = await this.stripe.accounts.create({
            type: 'custom',
            country: 'IN',
            business_type: 'individual',
            capabilities: { transfers: { requested: true } },
            
        });
        // add the captain id to fuction if needed
        // bank.captaion=captainId;
        captain.stripe_account_id = account.id;
        await captain.save();
        return account;

    }

    async createBankToken(captainName: string, uniqueNumber: string)
    {
        return this.stripe.tokens.create({
            bank_account: {
                country: 'IN',
                currency: 'INR',
                account_holder_name: captainName,
                account_holder_type: 'individual',
                routing_number: 'HDFC0000001',
                account_number: `0001234${uniqueNumber}`
            },
        });
    }

    async attachBankAccount(capatin: Captain, bankTokenId: string) {
        const externalAccount = await this.stripe.accounts.createExternalAccount(capatin.stripe_account_id, {
            external_account: bankTokenId
        });
        
        // Save in BankAccount model
        const bankAccountDoc = new this.bankModel({
            user: capatin._id,
            stripe_account_id: capatin.stripe_account_id,
            stripe_external_account_id: externalAccount.id,
            bank_last4: externalAccount.last4,
        });
        await bankAccountDoc.save();

        // Update driver doc
        capatin.stripe_external_account_id = externalAccount.id;
        capatin.bank_last4 = externalAccount.last4;
        await capatin.save();

        return externalAccount;
    }

    // Payout driver
    async payoutDriver(captain:Captain, amount: number) {
        const payout = await this.stripe.payouts.create(
            { amount, currency: 'inr' },
            { stripeAccount: captain.stripe_account_id }
        );
        return payout;
    }

    // Transfer driver share from platform balance
    async transferToDriver(paymentIntentId: string, captain:Captain, driverAmount: number) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        const transfer = await this.stripe.transfers.create({
            amount: driverAmount,
            currency: paymentIntent.currency,
            destination: captain.stripe_account_id,
        });
        return transfer;
    }

    constructEventFromPayload(signature: string, payload: Buffer) {
        const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

        if (!endpointSecret) {
            throw new Error("STRIPE_KEY is missing in environment variables");
        }

        return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    }
}
