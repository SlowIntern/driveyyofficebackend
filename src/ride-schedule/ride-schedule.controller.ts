import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RideScheduleService } from './ride-schedule.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ScheduleDto } from './dto/createSchedule.dto';

@Controller('ride-schedule')
export class RideScheduleController {
  constructor(private readonly rideScheduleService: RideScheduleService) { }
  
  @Post('scheduleRide')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createScheduleRide(@Req() req, @Body() dto: ScheduleDto) {
    return this.rideScheduleService.createScheduleRide(req.user, dto);
  }
}
