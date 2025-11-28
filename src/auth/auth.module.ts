import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from '../user/user.module'
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BlackListToken, BlackListTokenSchema } from './schemas/blacklist-token.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CaptainModule } from 'src/captain/captain.module';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [UserModule,CaptainModule,
    MongooseModule.forFeature([{name:BlackListToken.name,schema:BlackListTokenSchema}]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hsddsjsdbjbsbansahijwweyroiajjnsaksma',
      signOptions:{expiresIn:'60s'},
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,RolesGuard],
})
export class AuthModule {}
