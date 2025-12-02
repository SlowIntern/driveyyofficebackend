import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { BankModule } from 'src/bank/bank.module';
import { CaptainModule } from 'src/captain/captain.module';

import { RideService } from 'src/ride/ride.service';
import { Ride, RideSchema } from 'src/ride/rideSchema/ride.schema';
import { Captain, CaptainSchema } from 'src/captain/capschema/captain.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { MapService } from 'src/map/map.service';

@Module({
  imports: [
    BankModule,
   // forwardRef(() => CaptainModule), this will resolve circular dependency but recommend not to use it
    MongooseModule.forFeature([
      { name: Ride.name, schema: RideSchema },
      { name: Captain.name, schema: CaptainSchema },
      { name: User.name, schema: UserSchema }, // <--- Add this
    ]),
  ],
  controllers: [StripeController],
  providers: [StripeService, RideService,MapService],
  exports: [StripeService],
})
export class StripeModule { }
