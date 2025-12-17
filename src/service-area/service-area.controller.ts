import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { CreateServiceAreaDto } from './dto/service.dto';

@Controller('service-area')
export class ServiceAreaController {
  constructor(private readonly serviceAreaService: ServiceAreaService) { }
  


  @Post("area")
  create(@Body() body: CreateServiceAreaDto) {
    return this.serviceAreaService.create(body);
  }


  @Get()
  findAll() {
    return this.serviceAreaService.findAll();
  }




}
