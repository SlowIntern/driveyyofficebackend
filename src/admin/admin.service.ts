import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { Captain } from 'src/captain/capschema/captain.schema';
import { Ride } from 'src/ride/rideSchema/ride.schema';
import { BlackListEmail } from './schema/blackEmail.schema';

@Injectable()
export class AdminService {
  
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Captain.name) private readonly capModel: Model<Captain>,
    @InjectModel(Ride.name) private readonly rideModel: Model<Ride>,
    @InjectModel(BlackListEmail.name) private readonly blackModel: Model<BlackListEmail>) { }

  // get all user data
  async allUserDetails(): Promise<User[]> {        //Promise<User> for returning one user....
    const users = await this.userModel.find();
    users.forEach((user) => {
      user.password = "*********";
    });

    return users;
  }

  //get all captain details

  async allcaptainDetails() {
    return await this.capModel.find();
  }


  //get all ride details
  async allrideDetail() {
    return await this.rideModel.find();
  }

  

  // also create a feature for  block user or captain.
  async blockuser(user: any) {
    let blockuser;
    //first of check user role
    if (user.role === 'user') {
      blockuser = this.userModel.find({ _id: user._id });
    }
    else {
      blockuser = this.capModel.find({ _id: user._id });
    }


    blockuser.blocked = true;
    blockuser.save();

    //now after adding a block field in both user and captain model and set it
    // by default false so that the user or captain is not blocked
    // make it true so that they can get blocked

    //blockuser.blocked=true;
    // blockuser.save();
  }

  // delete user from the datbase
  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
  // delete captain from th database
  async deleteCaptain(id: string) {
    return this.capModel.findById(id).exec();
  }

  // blacklist email for rude that from that email no user and captain can create account

  // for user blacklist
  async blackLsitUser(email: string,role:string) {
    // write here logic for blacklisting the user by email)
      const blacklist = new this.blackModel({ email: email });
      return blacklist.save();
    
   
  }


  async stats() {
    return {
      users: await this.userModel.countDocuments(),
      captains: await this.capModel.countDocuments(),
      rides: await this.rideModel.countDocuments(),
    };

  }
  
  
}
