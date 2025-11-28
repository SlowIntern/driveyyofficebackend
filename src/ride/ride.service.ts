import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as crypto from 'crypto';
import { Ride } from './rideSchema/ride.schema';
import { MapService } from 'src/map/map.service';
import { CreateRideDto } from './dto/ride.dto.';
import { Captain } from 'src/captain/capschema/captain.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class RideService {
    constructor(
        @InjectModel(Ride.name) private readonly rideModel: Model<Ride>,
        @InjectModel(Captain.name) private readonly captainModel: Model<Captain>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly mapService: MapService,
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

        await this.rideModel.findByIdAndUpdate(rideId, { status: 'completed' });
        const captainInDb = await this.captainModel.findById(captain._id);
        if (captainInDb === null)
        {
            throw new BadRequestException('Fare not found');
        }
        captainInDb.totalEarnings += ride.fare;
        await captainInDb.save();

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

        await this.captainModel.findByIdAndUpdate(user._id, { status: 'inactive' });
        
        console.log("Here is the detail of the rideEnd by captain",ride);
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


    async currentRideDetails()
    {
        // write more optimal code this is not optimal for the multiple user because it can fetch all the user.....
        const currentRideDetails =await this.rideModel.findOne({ status: 'accepted' }).populate('captain').populate('user');
        if (!currentRideDetails)
        {
            throw new BadRequestException('No current ride found');
        }
        
        
        const data = {
            rideId: currentRideDetails._id,
            captainsocketId: currentRideDetails.captain.socketId,
            usersocketId: currentRideDetails.user.socketId
        }

        return data;
    }

    
    
}
