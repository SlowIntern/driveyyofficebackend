import { Controller, Post } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) { }
  

  @Post('distance')
  async getDistanceTime(pickup: string, destination: string) {
    
    return await this.mapService.getDistanceTime(pickup, destination);
  }
}
