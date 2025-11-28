import { Test, TestingModule } from '@nestjs/testing';
import { BankdetailsService } from './bankdetails.service';

describe('BankdetailsService', () => {
  let service: BankdetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankdetailsService],
    }).compile();

    service = module.get<BankdetailsService>(BankdetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
