import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedServiceController } from './verified-service.controller';
import { VerifiedServiceService } from './verified-service.service';

describe('VerifiedServiceController', () => {
  let controller: VerifiedServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifiedServiceController],
      providers: [VerifiedServiceService],
    }).compile();

    controller = module.get<VerifiedServiceController>(VerifiedServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
