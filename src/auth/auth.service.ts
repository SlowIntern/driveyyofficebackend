import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schema/user.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { BlackListToken } from './schemas/blacklist-token.schema';
import { DeleteDto } from './dto/deleteUser.dto';
import { CreateCaptainDto } from './dto/capregister.dto';
import { Captain } from 'src/captain/capschema/captain.schema';
import * as crypto from 'crypto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(BlackListToken.name) private blackModel: Model<BlackListToken>,
        @InjectModel(Captain.name) private captainModel: Model<Captain>,
        private jwtService: JwtService,
    ) { }

    //  Register new user
    async register(dto: RegisterDto) {
        const existUser = await this.userModel.findOne({ email: dto.email });

        if (existUser) {
            throw new BadRequestException('User already exists with this email');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);

        const user = new this.userModel({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password: hashPassword,
        });

        await user.save();

        const { password, ...safeUser } = user.toObject();

        return {
            message: 'User has been created successfully',
            user: safeUser,
        };
    }

    //  Login user and issue JWT
    async login(dto: LoginDto) {
        console.log("The login data is",dto);

        let user;
        if (dto.role === 'user') {
            user = await this.userModel.findOne({ email: dto.email }).select('+password');
        }
        else if (dto.role === 'captain') {
            user = await this.captainModel.findOne({ email: dto.email }).select('+password');
        }
        else {
            //for the admin role
            user =await this.userModel.findOne({ email: dto.email }).select('+password');
        }
        if (!user) throw new UnauthorizedException('Invalid email or password');

        if (user.isBlocked) {
            throw new BadRequestException("User has been blocked call on this 7876142601 number to unblock");
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid email or password');

        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload, { expiresIn: '1d' });

        return {
            user,
            token,
        };
    }

    // Logout user (blacklist token)
    async logoutUser(token: string) {
        if (!token) return { message: 'No token found' };

        const exists = await this.blackModel.findOne({ token });
        if (!exists) {
            await new this.blackModel({ token }).save();
        }

        return { message: 'User logged out successfully ' };
    }

    //Delete user
    async deleteUser(dto: DeleteDto) {
        const user = await this.userModel.findOne({ email: dto.email });

        if (!user) {
            throw new BadRequestException('The user with this email does not exist');
        }

        const comparePassword = await bcrypt.compare(dto.password, user.password);

        if (!comparePassword) {
            throw new BadRequestException("Password is incorrect");
        }

        await user.deleteOne();

        return { message: 'User deleted successfully' };
    }


    // --- from here the work of captain register and login begins ---

    async registerCap(dto: CreateCaptainDto) {
        const { email, password } = dto;

        // Already exist ustaad
        const existingCaptain = await this.captainModel.findOne({ email });
        if (existingCaptain) {
            throw new BadRequestException('Captain with this email already exists');
        }

        // password gupt krna
        const hashedPassword = await bcrypt.hash(password, 10);


        const newCaptain = new this.captainModel({
            ...dto,
            password: hashedPassword,
        });

        await newCaptain.save();

        const { password: _, ...captainWithoutPassword } = newCaptain.toObject();


        return {
            message: 'Captain registered successfully',
            captain: captainWithoutPassword,
        };
    }


    private generateOTP(length:number){
        
        const otp = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
        return otp;
        
    }


    async forgetPassword(emaily: string,role:string)
    {
        let user;
        if (role === 'user' || role === 'admin')
        {
            user = await this.userModel.findOne({ email: emaily })
        }
        else if (role === 'captain')
        {
            user = await this.captainModel.findOne({ email: emaily });
        }

        // here will be logic to send otp to the gmail right now i am just setting a random otp 
        // but here also will be a function to send otp in mail. complete remaining code as soon as possible

        const otp = this.generateOTP(4);


        const token = this.jwtService.sign({ sub: user._id, otp: otp, email: user.email });

        return token // after the frontend recieve this token it will decode it and match the otp or we can save the otp in the database
    }

    async changePassword(dto: ChangePasswordDto)
    {
        if (!dto.email || !dto.oldPassword || !dto.newPassword || !dto.role)
        {
            throw new BadRequestException("All the fields are required");
        }

        let user;


        //right now i am checking for two user role only one is user and another in captain but i will also add one more role that is admin
        if (dto.role === 'user')
        {
            user = this.userModel.findOne({ email: dto.email });
        }
        else
        {
            user = this.captainModel.findOne({ email: dto.email });
        }


        const match: boolean = await bcrypt.compare(dto.oldPassword, user.password);

        if (!match)
        {
            throw new BadRequestException("The password did not match with the old password");
        }

        
        // write rest of the code for change password.
        
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(dto.newPassword, salt);
        user.password = hashPass;
        user.save();
        
        return;
    }
}



