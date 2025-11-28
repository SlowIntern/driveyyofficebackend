import { Test, TestingModule } from '@nestjs/testing';
import { CaptainController } from './captain.controller';
import { CaptainService } from './captain.service';

describe('CaptainController', () => {
  let controller: CaptainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaptainController],
      providers: [CaptainService],
    }).compile();

    controller = module.get<CaptainController>(CaptainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
