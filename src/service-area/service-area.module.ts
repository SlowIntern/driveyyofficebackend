import { Module } from '@nestjs/common';
import { ServiceAreaService } from './service-area.service';
import { ServiceAreaController } from './service-area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceArea, ServiceAreaSchema } from './schema/service.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:ServiceArea.name,schema:ServiceAreaSchema}])],
  controllers: [ServiceAreaController],
  providers: [ServiceAreaService],
})
export class ServiceAreaModule {}
