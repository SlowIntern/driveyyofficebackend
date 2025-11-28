import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CaptainService } from './captain.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { UserRole } from 'src/user/schema/user.schema';

@Controller('captain')
export class CaptainController {
  constructor(private readonly captainService: CaptainService) { }
  
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
}
