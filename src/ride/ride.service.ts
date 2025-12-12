import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

import * as crypto from 'crypto';
import { Ride } from './rideSchema/ride.schema';
import { MapService } from 'src/map/map.service';
import { CreateRideDto } from './dto/ride.dto.';
import { Captain } from 'src/captain/capschema/captain.schema';
import { User } from 'src/user/schema/user.schema';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { RazorpayService } from 'src/razorpay/razorpay.service';

@Injectable()
export class RideService {
    constructor(
        @InjectModel(Ride.name) private readonly rideModel: Model<Ride>,
        @InjectModel(Captain.name) private readonly captainModel: Model<Captain>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly mapService: MapService,
        private readonly stripeService: StripeService,
        private readonly razorpayService: RazorpayService,
    ) { }

    // Calculate fare between pickup and destination 
    async getFare(pickup: string, destination: string) {
        if (!pickup || !destination) throw new BadRequestException('Pickup and destination are required');

        const distanceTime = await this.mapService.getDistanceTime(pickup, destination);

        const baseFare = { auto: 30, car: 50, moto: 20 };
        const perKmRate = { auto: 10, car: 15, moto: 8 };
        const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

        const fare = {
            auto: Math.round(baseFare.auto + (distanceTime.distance.value / 1000) * perKmRate.auto + (distanceTime.duration.value / 60) * perMinuteRate.auto),
            car: Math.round(baseFare.car + (distanceTime.distance.value / 1000) * perKmRate.car + (distanceTime.duration.value / 60) * perMinuteRate.car),
            moto: Math.round(baseFare.moto + (distanceTime.distance.value / 1000) * perKmRate.moto + (distanceTime.duration.value / 60) * perMinuteRate.moto),
        };

        return fare;
    }

    //otp for ride verification
    private getOtp(length: number) {
        return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
    }

    // function to create ride
    async createRide(user: string, dto: CreateRideDto) {
        const { pickup, destination, vehicleType } = dto;
    
        if (!user || !pickup || !destination || !vehicleType) {
            // console.log(user);
            // console.log(pickup);
            // console.log(destination);
            // console.log(vehicleType);
            throw new BadRequestException('All fields are required');
        }
       
        const userInDb = await this.userModel.findOne({ _id: user });

     //   if(userInDb?.isRiding) throw new NotFoundException('You are currently riding you donot book another ride');

        const fare = await this.getFare(pickup, destination);

        const ride = await this.rideModel.create({
            user,
            pickup,
            destination,
            otp: this.getOtp(6),
            fare: fare[vehicleType],
        });

        return ride;
    }

    // function to confirm ride as a captain
    async confirmRide({ rideId, captain }: { rideId: string; captain: any }) {
        if (!rideId) throw new BadRequestException('Ride id is required');

        const rideInDb = await this.rideModel.findById(rideId);

        if (!rideInDb) throw new NotFoundException('Ride not found');
        if(rideInDb.status==='accepted') throw new BadRequestException('Ride already accepted');

        await this.rideModel.findByIdAndUpdate(rideId, { status: 'accepted', captain: captain._id });

        await this.captainModel.findByIdAndUpdate(captain._id, {status: 'active'});

        const ride = await this.rideModel.findById(rideId).populate('user').populate('captain').select('+otp');
        
       
        
        if (!ride) throw new NotFoundException('Ride not found');

      
        return ride;
    }

    // Function to confirm the otp and start the ride 
    async startRide({ rideId, otp, captain }: { rideId: string; otp: string; captain: any }) {
        if (!rideId || !otp) throw new BadRequestException('Ride id and OTP are required');

        const ride = await this.rideModel.findById(rideId).populate('user').populate('captain').select('+otp');

        if (!ride) throw new NotFoundException('Ride not found');

        if (ride.otp !== otp) throw new BadRequestException('Invalid OTP');// match the otp
        if (ride.status !== 'accepted') throw new BadRequestException('Ride not accepted');
      //  if (ride.otp !== otp) throw new BadRequestException('Invalid OTP');

        await this.rideModel.findByIdAndUpdate(rideId, { status: 'ongoing' });

        return ride;
    }

    //End Ride
    async endRide({ rideId, captain }: { rideId: string; captain: any }) {
        if (!rideId) throw new BadRequestException('Ride id is required');

        const ride = await this.rideModel.findOne({ _id: rideId, captain: captain._id }).populate('user').populate('captain').select('+otp');

        if (!ride) throw new NotFoundException('Ride not found');
        if (ride.status !== 'ongoing') throw new BadRequestException('Ride not ongoing');

        const rides = await this.rideModel.findByIdAndUpdate(rideId, { status: 'completed' });
        
        console.log("Here is the detail of the ride before adding earning",rides);
        const captainInDb = await this.captainModel.findById(ride.captain._id);
        if (captainInDb === null)
        {
            throw new BadRequestException('Fare not found');
        }
        captainInDb.totalEarnings += Number(ride.fare);

        console.log("Here is the detail of the totalearnig",captainInDb.totalEarnings);

        await captainInDb.save();

        console.log("Here is the detail of the captain after adding earning",captainInDb);

        await this.captainModel.findByIdAndUpdate(captain._id, { status: 'inactive' }); // after the ride is completed the captain is available for another rides

        return ride;
    }

    async endRideByMe(user:any)  // complete this function to complete the ride this function is created by me
    {
        const ride = await this.rideModel.findOne({ status: 'ongoing', captain: user._id }).populate('user').populate('captain').select('+otp');
        
        if (!ride)
        {
            throw new NotFoundException('Ride not found');
        }

        await this.rideModel.findByIdAndUpdate(ride._id, { status: 'completed' });

        const captain = await this.captainModel.findById(ride.captain._id); 
        if (!captain)
        {
            throw new BadRequestException('Captain not found');
        }
        captain.totalEarnings += Number(ride.fare);

        await captain.save();

        await this.captainModel.findByIdAndUpdate(user._id, { status: 'inactive' });
        
     //   console.log("Here is the detail of the rideEnd by captain",ride);
        return ride;
    }

    async allCaptains()
    {
        return await this.captainModel.find({status: 'inactive'}); // now the notification is send to available drivers only.
    }

    

    // Get history of user rides
    async getRideWithUser(rideId: string) {
        return this.rideModel.findById(rideId).populate('user').exec();
    }


    // this will return all the ride for admin use only
    async getAllRides()
    {

        const allridesdetail = this.rideModel.find().exec();
        
        return allridesdetail;
    }



//     async currentRideDetails(rideId: any) {
    
//         console.log("user in the currentRideDetails funtion", user);
//     const userId = user._id instanceof mongoose.Types.ObjectId
//         ? user._id
//         : new mongoose.Types.ObjectId(user._id);

//         console.log("userId in the currentRideDetails funtion", userId);

//     let ride;

//     if (user.role === 'captain') {
//         // For captains, find ride where they are assigned as captain
//         ride = await this.rideModel
//             .findOne({
//                 captain: userId,
//                 status: { $in: ['pending', 'accepted', 'ongoing'] }
//             })
//             .populate([
//                 { path: 'user', select: 'name socketId' },
//                 { path: 'captain', select: 'name vehicle socketId' }
//             ])
//             .lean();
//     } else {
//         // For normal users, find ride where they are the user
//         ride = await this.rideModel
//             .findOne({
//                 user: userId,
//                 status: { $in: ['pending', 'accepted', 'ongoing'] }
//             })
//             .populate([
//                 { path: 'user', select: 'name socketId' },
//                 { path: 'captain', select: 'name vehicle socketId' }
//             ])
//             .lean();
//     }
        
//         console.log("ride in the currentRideDetails funtion", ride);

//     if (!ride) {
//         throw new BadRequestException('No current ride found');
//     }
//     return {
//         rideId: ride._id.toString(),
//         userId: ride.user?._id?.toString() || null,
//         captainId: ride.captain?._id?.toString() || null,
//         userSocketId: ride.user?.socketId || null,
//         captainSocketId: ride.captain?.socketId || null,
//         pickup: ride.pickup,
//         destination: ride.destination,
//         fare: ride.fare || null,
//         status: ride.status
//     };
    // }
    

    async currentRideDetails(rideId: string) {
        if (!rideId) {
            throw new BadRequestException('Ride ID is required');
        }

        // Convert to ObjectId if needed
        const rideObjectId = Types.ObjectId.isValid(rideId) ? new Types.ObjectId(rideId) : null;
        if (!rideObjectId) {
            throw new BadRequestException('Invalid Ride ID');
        }

        const ride = await this.rideModel
            .findById(rideObjectId)
            .populate([
                { path: 'user', select: 'name socketId' },
                { path: 'captain', select: 'name vehicle socketId' },
            ])
            .lean();

        if (!ride) {
            throw new BadRequestException('Ride not found');
        }
        
        const captain=await this.captainModel.findById(ride.captain._id);
        if(!captain)
        {
            throw new BadRequestException('Captain not found');
        }   
        const user=await this.userModel.findById(ride.user._id);
        if(!user)
        {
            throw new BadRequestException('User not found');
        }   

        const CaptainName=captain.firstName + ' ' + captain.lastname;

        const UserName=user.firstName + ' ' + user.lastName;
    
        const data= {
            rideId: ride._id.toString(),
            userId: ride.user?._id?.toString() || null,
            captainId: ride.captain?._id?.toString() || null,
            userSocketId: ride.user?.socketId || null,
            captainSocketId: ride.captain?.socketId || null,
            pickup: ride.pickup,
            destination: ride.destination,
            fare: ride.fare ?? null,
            status: ride.status,
            otp: ride.otp,
            CaptainName: CaptainName,
            UserName: UserName,
        };

        console.log("Current Ride Details from the backend", data);

        return data;
    }

    async createPayment(rideId: string) {
        const ride = await this.rideModel.findById(rideId);
        if (!ride) throw new Error('Ride not found');

        const paymentIntent = await this.stripeService.createPaymentIntent(ride.fare * 100);
        ride.stripePaymentIntentId = paymentIntent.id;
        ride.payoutStatus = 'pending';
        await ride.save();

        return { client_secret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
    }

    // Called after Stripe webhook payment success
    async onPaymentSuccess(paymentIntentId: string) {
        const ride = await this.rideModel.findOne({ stripePaymentIntentId: paymentIntentId }).populate('captain');
        if (!ride) return;

        ride.payoutStatus = 'paid';
        const paymentIntent = await this.stripeService.stripe.paymentIntents.retrieve(paymentIntentId);
        ride.stripeChargeId = paymentIntent.latest_charge as string;

        await ride.save();

        const driverShare = Math.floor(ride.fare * 100 * 0.8); // 80%
        const transfer = await this.stripeService.transferToDriver(paymentIntentId, ride.captain, driverShare);

        ride.stripeTransferId = transfer.id;
        await ride.save();
    }



    async updateCaptainStripeStatus(
        stripeAccountId: string,
        stripeAccount: Stripe.Account,
    ) {
        const captain = await this.captainModel.findOne({ stripe_account_id: stripeAccountId });
        if (!captain) {
            throw new BadRequestException('Captain not found');
        }

        captain.stripe_charges_enabled = stripeAccount.charges_enabled ?? false;
        captain.stripe_payouts_enabled = stripeAccount.payouts_enabled ?? false;
        captain.stripe_requirements_due = stripeAccount.requirements?.currently_due || [];

        await captain.save();

        return captain;
    }

    async findById(rideId: string) {
        return this.rideModel.findById(rideId);
    }
      
    // razorpay

    async createRazorpayPayment(rideId: string) {
        const ride = await this.rideModel.findById(rideId);
      //  console.log("Ride in the db",ride);
        if (!ride) throw new BadRequestException('Ride not found');

        const order = await this.razorpayService.createOrder(ride.fare * 100); // convert to paise
        ride.razorpayOrderId = order.id;
        ride.payoutStatus = 'paid';
        await ride.save();

        return { orderId: order.id, amount: order.amount, currency: order.currency };
    }

    async completeRazorpayPayment(rideId: string, paymentId: string) {
        const ride = await this.rideModel.findById(rideId).populate('captain');
        if (!ride) throw new BadRequestException('Ride not found');

        const payment = await this.razorpayService.fetchPayment(paymentId);
        if (payment.status !== 'captured') throw new BadRequestException('Payment not completed');

        ride.payoutStatus = 'paid';
        ride.razorpayPaymentId = payment.id;

        // Transfer 80% to driver
        const driverShare = Math.floor(ride.fare * 100 * 0.8);

        if (!ride.captain.razorpayAccountId) {
            throw new Error('Captain does not have a Razorpay account');
        }

      const transfer=  await this.razorpayService.transferToDriver(ride.captain.razorpayAccountId, driverShare);

        console.log("Razorpay Transfer Details:", transfer);      
        ride.payoutId = transfer.id;
        await ride.save();
        return ride;
    }


   async captianDashboard(captain: Captain) {
    const captainInDb = await this.captainModel.findById(captain._id);
    if (!captainInDb) throw new BadRequestException('Captain not found');

    // Get all rides of this captain
    const rides = await this.rideModel
        .find({ captain: captain._id })
        .select(" pickup destination fare status createdAt") // pick req fields
        .lean(); // improves performance

    return {
        totalEarning: captainInDb.totalEarnings,
        totalRides: rides.length,
        rideHistory: rides, // full list of rides
    };
   }
}
