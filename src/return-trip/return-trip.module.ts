import { Module } from '@nestjs/common';
import { ReturnTripService } from './return-trip.service';
import { ReturnTripController } from './return-trip.controller';

@Module({
  controllers: [ReturnTripController],
  providers: [ReturnTripService],
})
export class ReturnTripModule {}
