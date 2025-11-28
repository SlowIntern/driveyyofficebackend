import { Test, TestingModule } from '@nestjs/testing';
import { BankdetailsController } from './bankdetails.controller';
import { BankdetailsService } from './bankdetails.service';

describe('BankdetailsController', () => {
  let controller: BankdetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankdetailsController],
      providers: [BankdetailsService],
    }).compile();

    controller = module.get<BankdetailsController>(BankdetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
