import { Test, TestingModule } from '@nestjs/testing';
import { TestchatService } from './testchat.service';

describe('TestchatService', () => {
  let service: TestchatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestchatService],
    }).compile();

    service = module.get<TestchatService>(TestchatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
