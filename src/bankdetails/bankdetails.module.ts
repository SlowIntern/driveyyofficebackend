import { Module } from '@nestjs/common';
import { BankdetailsService } from './bankdetails.service';
import { BankdetailsController } from './bankdetails.controller';

@Module({
  controllers: [BankdetailsController],
  providers: [BankdetailsService],
})
export class BankdetailsModule {}
