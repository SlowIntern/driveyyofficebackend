import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SendMessageGateway } from './sendmessage.gateway';
import { Ride, RideSchema } from 'src/ride/rideSchema/ride.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Captain, CaptainSchema } from 'src/captain/capschema/captain.schema';
import { RideModule } from 'src/ride/ride.module';
import { UserModule } from 'src/user/user.module';
import { CaptainModule } from 'src/captain/captain.module';

@Module({
    imports: [
        // Register the Mongoose models for all schemas used in the gateway
        MongooseModule.forFeature([
            { name: Ride.name, schema: RideSchema },
            { name: User.name, schema: UserSchema },
            { name: Captain.name, schema: CaptainSchema },
        ]),

        // Avoid circular dependency problems
        forwardRef(() => RideModule),
        forwardRef(() => UserModule),
        forwardRef(() => CaptainModule),
    ],

    providers: [SendMessageGateway], // Register the gateway
    exports: [SendMessageGateway],   // Make it usable in other modules
})
export class SendmessageModule { }
