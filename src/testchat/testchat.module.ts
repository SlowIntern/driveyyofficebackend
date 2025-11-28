import { Module } from '@nestjs/common';
import { TestchatGateway } from './testchat.gateway';
import { TestchatService } from './testchat.service';

@Module({
    providers:[TestchatGateway,TestchatService],
})
export class TestchatModule {}
