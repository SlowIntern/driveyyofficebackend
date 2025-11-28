import { forwardRef, Module } from '@nestjs/common';
import { CaptainService } from './captain.service';
import { CaptainController } from './captain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Captain, CaptainSchema } from './capschema/captain.schema';
import { RideModule } from 'src/ride/ride.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports:[MongooseModule.forFeature([{ name: Captain.name, schema: CaptainSchema }]),forwardRef(() => StripeModule)],
  controllers: [CaptainController],
  providers: [CaptainService],
  exports:[MongooseModule]
})
export class CaptainModule {}
