import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScheduleDto } from './dto/createSchedule.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RideSchedule, Status } from './schema/schedule.schema';
import { RideService } from 'src/ride/ride.service';
import { User } from 'src/user/schema/user.schema';
import { verify } from 'crypto';


@Injectable()
export class RideScheduleService {

    constructor(@InjectModel(RideSchedule.name) private readonly scheduleModel: Model<RideSchedule>
       , private readonly rideservice:RideService,
    ) { }

    async createScheduleRide(userId: string, dto: ScheduleDto) {
        if (!userId || !dto) {
            throw new Error("User or dto not found");
        }

        // const newSchedule = new this.scheduleModel({
        //     userId: userId,
        //     pickup: dto.pickup,
        //     destination: dto.destination,
        //     date: dto.date,
        //     time: dto.time,
        // });

        const newSchedule = new this.scheduleModel({
            User: userId,
            pickup: dto.pickup,
            destination: dto.destination,
            date: dto.date,
            time: dto.time,
            vehicleType:dto.vehicleType
        });

        if (!newSchedule) {
            throw new Error("Schedule not created");
        }

        newSchedule.save();
        //        return newSchedule.save();

        return {
            message: "Schedule ride have been created",
            data: newSchedule
        }
    }




    @Cron(CronExpression.EVERY_MINUTE)
    async notifyBeforeOneMinute() {

        const now = new Date();  // current time

        // get current time trimmed to seconds=0
        now.setSeconds(0);
        now.setMilliseconds(0);

        const upcomingRides = await this.scheduleModel.find({
            status: Status.Pending, // only rides not yet processed
        });

        for (const ride of upcomingRides) {
            const scheduleTime = this.getScheduledDateTime(ride);

            // Calculate notification time (1 minute before)
            const notifyTime = new Date(scheduleTime.getTime() - 1 * 60 * 1000);

            if (notifyTime.getTime() === now.getTime()) {
                console.log(`Sending notification for ride ${ride._id}`);

                const dto = {
                    pickup: ride.pickup,
                    destination: ride.destination,
                    vehicleType: ride.vehicleType as 'auto' | 'car' | 'moto',
        
                }
                const id = ride.User._id.toString();


                  this.rideservice.createRide(id,dto);
                //  SEND REQUEST HERE
                // Send push notification, message, or auto-assign logic
                // Example:
                // await this.notificationService.sendUser(ride.userId, "Your ride is coming in 1 minute");
                // mark ride so we don't send again
                ride.status = Status.Accepted; // or "notified"
                await ride.save();
            }
        }
    }

    // get time of schedule ride
    getScheduledDateTime(ride) {
        const [hours, minutes] = ride.time.split(':').map(Number);
        const date = new Date(ride.date);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }


}
