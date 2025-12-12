import { Test, TestingModule } from '@nestjs/testing';
import { ReturnTripController } from './return-trip.controller';
import { ReturnTripService } from './return-trip.service';

describe('ReturnTripController', () => {
  let controller: ReturnTripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnTripController],
      providers: [ReturnTripService],
    }).compile();

    controller = module.get<ReturnTripController>(ReturnTripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
