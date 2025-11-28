import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccount, BankAccountSchema } from './schema/bank.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:BankAccount.name,schema:BankAccountSchema}])],
  controllers: [BankController],
  providers: [BankService],
  exports:[MongooseModule]
})
export class BankModule {}
