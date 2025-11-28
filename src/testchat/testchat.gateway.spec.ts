import { Test, TestingModule } from '@nestjs/testing';
import { TestchatGateway } from './testchat.gateway';

describe('TestchatGateway', () => {
  let gateway: TestchatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestchatGateway],
    }).compile();

    gateway = module.get<TestchatGateway>(TestchatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
