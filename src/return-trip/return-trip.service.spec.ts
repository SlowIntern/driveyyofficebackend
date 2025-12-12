import { Test, TestingModule } from '@nestjs/testing';
import { ReturnTripService } from './return-trip.service';

describe('ReturnTripService', () => {
  let service: ReturnTripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnTripService],
    }).compile();

    service = module.get<ReturnTripService>(ReturnTripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
