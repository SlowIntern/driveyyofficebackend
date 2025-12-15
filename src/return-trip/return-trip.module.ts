import { Module } from '@nestjs/common';
import { ReturnTripService } from './return-trip.service';
import { ReturnTripController } from './return-trip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnTrips, ReturnTripSchema } from './schema/return.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ReturnTrips.name, schema: ReturnTripSchema },

  ])],
  controllers: [ReturnTripController],
  providers: [ReturnTripService],
})
export class ReturnTripModule {}
