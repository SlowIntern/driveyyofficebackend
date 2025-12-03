import { Test, TestingModule } from '@nestjs/testing';
import { RideScheduleController } from './ride-schedule.controller';
import { RideScheduleService } from './ride-schedule.service';

describe('RideScheduleController', () => {
  let controller: RideScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideScheduleController],
      providers: [RideScheduleService],
    }).compile();

    controller = module.get<RideScheduleController>(RideScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
