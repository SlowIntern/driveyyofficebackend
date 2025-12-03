import { Test, TestingModule } from '@nestjs/testing';
import { RideScheduleService } from './ride-schedule.service';

describe('RideScheduleService', () => {
  let service: RideScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RideScheduleService],
    }).compile();

    service = module.get<RideScheduleService>(RideScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
