import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnTrips } from './schema/return.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReturnTripService {
    constructor(@InjectModel(ReturnTrips.name) private readonly returnTripModel:Model<ReturnTrips>) { }
    
    async processReturnTrip()
    {

        console.log("Write the logic for return trip processing here");

    }


    async DetailsOfReturnTrip()
    {

        const trips = await this.returnTripModel.find();
        return trips;   
    }
        
    }
