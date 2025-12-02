import { BadRequestException, Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CaptainService } from './captain.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { UserRole } from 'src/user/schema/user.schema';
import { StripeService } from 'src/stripe/stripe.service';
import { InjectModel } from '@nestjs/mongoose';
import { Captain } from './capschema/captain.schema';
import { Model } from 'mongoose';

@Controller('captain')
export class CaptainController {
  private stripeService: StripeService;
  constructor(private readonly captainService: CaptainService,
    @InjectModel(Captain.name) private captainModel: Model<Captain>,
  ) { }
  
  @Post('offline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CAPTAIN)
  async offline(@Req() req) {
    return this.captainService.offline(req.user);
  }

  @Post('online')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CAPTAIN)
  async online(@Req() req) {
    return this.captainService.online(req.user);
  }




  // Create Stripe Connect Account
  @Post('create-account/:captainId')
  async createAccount(@Param('captainId') captainId: string) {
    const captain = await this.captainModel.findById(captainId);
    if (!captain) throw new BadRequestException('Captain not found');

    return this.stripeService.createDriverAccount(captain);
  }

  // Add bank account
  @Post('add-bank/:captainId')
  async addBank(
    @Param('captainId') captainId: string,
    @Body() body: { accountHolderName: string; accountNumber: string },
  ) {
    const captain = await this.captainModel.findById(captainId);
    if (!captain) throw new BadRequestException('Captain not found');

    const bankToken = await this.stripeService.createBankToken(body.accountHolderName, body.accountNumber);
    return this.stripeService.attachBankAccount(captain, bankToken.id);
  }

  // Manual payout
  @Post('payout/:captainId')
  async payout(
    @Param('captainId') captainId: string,
    @Body() body: { amount: number },
  ) {
    const captain = await this.captainModel.findById(captainId);
    if (!captain) throw new BadRequestException('Captain not found');

    return this.stripeService.payoutDriver(captain, body.amount);
  }
}
