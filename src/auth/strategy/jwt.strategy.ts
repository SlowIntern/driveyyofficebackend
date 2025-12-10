import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { BlackListToken } from '../schemas/blacklist-token.schema';
import { Request } from 'express';
import { Captain } from 'src/captain/capschema/captain.schema';

@Injectable()
export class JwtStrategy extends
  PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(BlackListToken.name)
        private readonly blackListTokenModel: Model<BlackListToken>,
        @InjectModel(Captain.name) private readonly captainModel:Model<Captain>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.token || null,
            ]),
            secretOrKey: process.env.JWT_SECRET || 'hsddsjsdbjbsbansahijwweyroiajjnsaksma',
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {

        const token = req.cookies?.token;

        if (!token) {
            throw new UnauthorizedException('No token found in cookies');
        }

        const isBlacklisted = await this.blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            throw new UnauthorizedException('Token blacklisted');
        }

        let user;
        if (payload.role === 'user' || payload.role === 'admin') {
            user = await this.userModel.findById(payload.sub).select('-password');
        } else if (payload.role === 'captain') {
            user = await this.captainModel.findById(payload.sub).select('-password');
        }
        if (!user) {
            throw new UnauthorizedException('User not found or deleted');
        }
      //  console.log(user);
        return user;
    }
}
