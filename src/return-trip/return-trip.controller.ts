import { Controller } from '@nestjs/common';
import { ReturnTripService } from './return-trip.service';

@Controller('return-trip')
export class ReturnTripController {
  constructor(private readonly returnTripService: ReturnTripService) {}
}
