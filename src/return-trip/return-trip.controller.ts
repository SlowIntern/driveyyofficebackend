import { Controller, Get } from '@nestjs/common';
import { ReturnTripService } from './return-trip.service';

@Controller('return-trip')
export class ReturnTripController {
  constructor(private readonly returnTripService: ReturnTripService) { }
  

  @Get('details')
  async getReturnTripDetails() {
    return this.returnTripService.DetailsOfReturnTrip();
  }
}
