import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Captain } from 'src/captain/capschema/captain.schema';
import { BankAccount } from 'src/bank/schema/bank.schema';

@Injectable()
export class StripeService {
    stripe: Stripe;

    constructor(
        private configService: ConfigService,
        @InjectModel(BankAccount.name) private bankModel: Model<BankAccount>,
        @InjectModel(Captain.name) private captainModel: Model<Captain>,
    ) {
        const secretKey = this.configService.get<string>('STRIPE_KEY');
        if (!secretKey) throw new Error('Missing STRIPE_KEY');
        this.stripe = new Stripe(secretKey, { apiVersion: '2025-10-29.clover' });

    }

    // Create Stripe Payment Intent
    async createPaymentIntent(amount: number, currency = 'inr') {
        return this.stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'],
        });
    }

    // Create Stripe Custom Connect Account
    async createDriverAccount(captain: Captain) {
        const account = await this.stripe.accounts.create({
            type: 'custom',
            country: 'IN',
            business_type: 'individual',
            capabilities: { transfers: { requested: true } },
        });

        if(!account) throw new BadRequestException('Account not created');

        captain.stripe_account_id = account.id;
        captain.stripe_charges_enabled = account.charges_enabled ?? false;
        captain.stripe_payouts_enabled = account.payouts_enabled ?? false;
        captain.stripe_requirements_due = account.requirements?.currently_due || []; 
        await captain.save();
        return account;
    }

    // Create bank token (test)
    async createBankToken(accountHolder: string, accountNumber: string) {
        return this.stripe.tokens.create({
            bank_account: {
                country: 'IN',
                currency: 'INR',
                account_holder_name: accountHolder,
                account_holder_type: 'individual',
                routing_number: 'HDFC0000001',
                account_number: accountNumber,
            },
        });
    }

    // Attach bank account to driver
    async attachBankAccount(captain: Captain, tokenId: string) {
        const externalAccount = await this.stripe.accounts.createExternalAccount(
            captain.stripe_account_id,
            { external_account: tokenId },
        );
        captain.stripe_external_account_id = externalAccount.id;
        captain.bank_last4 = externalAccount.last4;
        await captain.save();

        // Save in Bank model
        const bankDoc = new this.bankModel({
            user: captain._id,
            stripe_account_id: captain.stripe_account_id,
            stripe_external_account_id: externalAccount.id,
            bank_last4: externalAccount.last4,
        });
        await bankDoc.save();

        return externalAccount;
    }

    // Transfer to driver
    async transferToDriver(paymentIntentId: string, captain: Captain, amount: number) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return this.stripe.transfers.create({
            amount,
            currency: paymentIntent.currency,
            destination: captain.stripe_account_id,
        });
    }

    // Payout to driver bank account
    async payoutDriver(captain: Captain, amount: number) {
        return this.stripe.payouts.create(
            { amount, currency: 'inr' },
            { stripeAccount: captain.stripe_account_id },
        );
    }

    constructEventFromPayload(signature: string, payload: Buffer) {
        const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!endpointSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    }
}
