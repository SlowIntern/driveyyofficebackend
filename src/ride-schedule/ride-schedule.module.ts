import { Module } from '@nestjs/common';
import { RideScheduleService } from './ride-schedule.service';
import { RideScheduleController } from './ride-schedule.controller';
import { RideSchedule, RideScheduleSchema } from './schema/schedule.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RideModule } from 'src/ride/ride.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: RideSchedule.name, schema: RideScheduleSchema }]),
  RideModule],
  controllers: [RideScheduleController],
  providers: [RideScheduleService],
  exports:[RideScheduleService]
})
export class RideScheduleModule {}
