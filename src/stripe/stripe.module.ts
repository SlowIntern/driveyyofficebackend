import { forwardRef, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { BankModule } from 'src/bank/bank.module';
import { CaptainModule } from 'src/captain/captain.module';

@Module({
  imports:[BankModule,forwardRef(() => CaptainModule)],
  controllers: [StripeController],
  providers: [StripeService],
  exports:[StripeService]
})
export class StripeModule {}
