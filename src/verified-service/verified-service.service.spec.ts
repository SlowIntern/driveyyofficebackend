import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedServiceService } from './verified-service.service';

describe('VerifiedServiceService', () => {
  let service: VerifiedServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifiedServiceService],
    }).compile();

    service = module.get<VerifiedServiceService>(VerifiedServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
