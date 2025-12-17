import { Test, TestingModule } from '@nestjs/testing';
import { ServiceAreaController } from './service-area.controller';
import { ServiceAreaService } from './service-area.service';

describe('ServiceAreaController', () => {
  let controller: ServiceAreaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceAreaController],
      providers: [ServiceAreaService],
    }).compile();

    controller = module.get<ServiceAreaController>(ServiceAreaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
