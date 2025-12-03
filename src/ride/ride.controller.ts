import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RideService } from './ride.service';
import { MapService } from 'src/map/map.service';
import { SendMessageGateway } from 'src/sendmessage/sendmessage.gateway';
import { ConfirmRideDto, CreateRideDto, EndRideDto } from './dto/ride.dto.';
import type { Response } from 'express';
import type { AuthenticatedRequest } from 'src/types/express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { UserRole } from 'src/user/schema/user.schema';

@Controller('rides')
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly mapService: MapService,
    private readonly sendMessageGateway: SendMessageGateway,
  ) { }

  // Create Ride 
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRide(
    @Body() dto: CreateRideDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {

    const userId = req.user?._id;  //|| '672f3458f3a6d6ab2e2c23ab';
    console.log(userId);
    try {
      console.log("Dto is defined", dto);
      if (!userId) {  // change it with req.user?._id after testing it
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      console.log("Dto is defined",dto);

      const ride = await this.rideService.createRide(
         userId.toString(),dto);

      const pickupCoordinates = await this.mapService.getAddressCoordinate(
        dto.pickup,
      );
      // const captainsInRadius = await this.mapService.getCaptainsInTheRadius(
      //   pickupCoordinates.ltd,
      //   pickupCoordinates.lng,
      //   2,
      // );

       const captainsInRadius = await this.rideService.allCaptains();  // for checking only

      ride.otp = '';

      const rideWithUser = await this.rideService.getRideWithUser(
        ride._id.toString(),
      );
       captainsInRadius.forEach((captain) => {
         console.log("Here the socket Id Does it Working",captain.socketId);
       })
      // Notify all nearby captains
      captainsInRadius.forEach((captain) => {
        if (captain.socketId) {
          console.log("Sending request to every user in the range",captain.socketId);
          this.sendMessageGateway.sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: rideWithUser,
          });
        }
      });

      return res.status(HttpStatus.CREATED).json(ride);
    } catch (err: any) {
      console.error(err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
  GET
  // Get Fare 
  @Post('fare')
  async getFare(
    @Query('pickup') pickup: string,
    @Query('destination') destination: string,
    @Res() res: Response,
  ) {
    try {
      const fare = await this.rideService.getFare(pickup, destination);
      return res.status(HttpStatus.OK).json(fare);
    } catch (err: any) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  // Confirm Ride (Captain accepts) 
  @Post('confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CAPTAIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))

  async confirmRide(
    @Body() dto: ConfirmRideDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {
      // if (!req.captain) {
      //   return res
      //     .status(HttpStatus.UNAUTHORIZED)
      //     .json({ message: 'Unauthorized' });
      // }

      const captain = req.user || { // change it for the user 
        _id: '672f3458f3a6d6ab2e2c23ac', // Your default captain ID
        firstName: 'Default',
        lastName: 'Captain',
      };

      const ride = await this.rideService.confirmRide({
        rideId: dto.rideId,
        captain
      });

      if (ride?.user?.socketId) {
        console.log("Sending request to user:", ride.user.socketId);

        this.sendMessageGateway.sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-confirmed',
          data: ride,
        });
      }

      
      

      console.log("Arre chal na badwa",ride.user.socketId);
     // await this.sendMessageGateway.sendRideEvent(ride._id.toString(), 'ride-confirmed', ride);
      
      return res.status(HttpStatus.OK).json(ride);
    } catch (err: any) {
      console.error(err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  // Start Ride 
  @Post('start')
  @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.CAPTAIN)
  async startRide(
    @Query('rideId') rideId: string,
    @Query('otp') otp: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {

      const captain = req.captain || { // change it for the user 
        _id: '672f3458f3a6d6ab2e2c23ac', // Your default captain ID
        firstName: 'Default',
        lastName: 'Captain',
      };
      // if (!req.captain) {
      //   return res
      //     .status(HttpStatus.UNAUTHORIZED)
      //     .json({ message: 'Unauthorized' });
      // }

      const ride = await this.rideService.startRide({
        rideId,
        otp,
        // captain: req.captain,
        captain
      });

      if (ride?.user?.socketId) {
        this.sendMessageGateway.sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-started',
          data: ride,
        });
      }

      return res.status(HttpStatus.OK).json(ride);
    } catch (err: any) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  // End Ride 
  @Post('end')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async endRide(
    @Body() dto: EndRideDto,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    try {

      const captain = req.captain || { // change it for the user 
        _id: '672f3458f3a6d6ab2e2c23ac', // Your default captain ID
        firstName: 'Default',
        lastName: 'Captain',
      }
      // if (!req.captain) {
      //   return res
      //     .status(HttpStatus.UNAUTHORIZED)
      //     .json({ message: 'Unauthorized' });
      // }

      const ride = await this.rideService.endRide({
        rideId: dto.rideId,
        //captain: req.captain,
        captain
      });

      if (ride?.user?.socketId) {
        this.sendMessageGateway.sendMessageToSocketId(ride.user.socketId, {
          event: 'ride-ended',
          data: ride,
        });
      }

      return res.status(HttpStatus.OK).json(ride);
    } catch (err: any) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }
  

  // this function is used to get the details of all the rides.
  @Get('allrides')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllridesDetail()
  {
    return this.rideService.getAllRides();
  }


  @Get('currentride')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCurrentRide()
  {
    return this.rideService.currentRideDetails();
  }

  




  @Get('endridebyme')
    @UseGuards(JwtAuthGuard)
    getendride(@Req() req) {
    return this.rideService.endRideByMe(req.user);      
  }


  @Post('payment')
  async payment(@Body('rideId') rideId: string) {
    console.log("Ride ID from frontend:", rideId);
    return this.rideService.createRazorpayPayment(rideId);
  }

  

}
