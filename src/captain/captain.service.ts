import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Captain } from './capschema/captain.schema';
import { Model } from 'mongoose';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class CaptainService {
    constructor(@InjectModel(Captain.name) private captainModel: Model<Captain>,
    private stripeService: StripeService) { }
    
    async getCaptainProfile(emaily: string)
    {
        if (!emaily)
        {
            throw new BadRequestException("Email field is required");
        }

        const captain = await this.captainModel.findOne({ email: emaily });

        if (!captain)
        {
            throw new BadRequestException("Captain with this email didnot exist please provide a valid email");
        }

        return captain;

    }


    // Seed multiple test drivers
    // async seedDrivers() {
    //     const results = [];
    //     for (let i = 0; i < driverNames.length; i++) {
    //         const name = driverNames[i];
    //         const email = `driver${i}@test.com`;

    //         const driver = new this.captainModel({ name, email });
    //         await driver.save();

    //         await this.stripeService.createDriverAccount(driver);

    //         const bankToken = await this.stripeService.createBankToken(name, `${i}`);
    //         await this.stripeService.attachBankAccount(driver, bankToken.id);

    //         results.push(driver);
    //     }
    //     return results;
    // }

    // Payout all drivers
    async payoutAllDrivers(amountPerDriver: number) {
        const drivers = await this.captainModel.find();
        const payouts = [];
        for (const driver of drivers) {
            const payout = await this.stripeService.payoutDriver(driver, amountPerDriver);
    //            payouts.push({ driver: driver.name, payout });
        }
        return payouts;
    }

    async cancelpayment() {
        return 'no payment for you do some work you shit head';
    }


    async offline(captain:Captain)
    {
        const captainInDb = await this.captainModel.findById(captain._id);
        
        if(!captainInDb) throw new BadRequestException('Captain not found');


        captainInDb.status='offline';
        await captainInDb.save();
    }

    async online(captain:Captain)
    {
        const captainInDb = await this.captainModel.findById(captain._id);
        
        if(!captainInDb) throw new BadRequestException('Captain not found');
        captain.status='active';
        await captain.save();
    }

    async captainEarning()
    {
        return this.captainModel.find().sort({ totalEarnings: -1 });
        
    }

    

   

}
