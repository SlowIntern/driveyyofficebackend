import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { CaptainModule } from 'src/captain/captain.module';


@Module({
  imports:[CaptainModule],
  controllers: [MapController],
  providers: [MapService],
  exports:[MapService]
})
export class MapModule {}
