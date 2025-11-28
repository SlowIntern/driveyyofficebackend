import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageGateway } from './sendmessage.gateway';


describe('SendmessageGateway', () => {
  let gateway: SendMessageGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageGateway],
    }).compile();

    gateway = module.get<SendMessageGateway>(SendMessageGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
