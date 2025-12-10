import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/decorators/roles.decorator';
import { UserRole } from 'src/user/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async users()
  {
    return this.adminService.allUserDetails();
  }

  @Get('captains')
  async captain()
  {
    return this.adminService.allcaptainDetails();
  }

  @Get('rides')
  async rides()
  {
    return this.adminService.allrideDetail();
  }

  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Get('stats')
  async stats()
  {
    return this.adminService.stats();
  }
  @Post('blockuser')
  async blockuser(@Body() user: any)
  {
    return this.adminService.blockuser(user);
  } 

  @Post('verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // only admin can verify
  async verify(@Body('captainId') captainId: string) {
   // console.log("Captain ID received:", captainId);
    return this.adminService.verifiedDriver(captainId);
  }


  @Get('captains/:captainId')
  async getCaptainDetail(@Param('captainId') captainId: string) {
    if (!captainId) {
      throw new BadRequestException('Captain ID is required');
    }

    const data = await this.adminService.captainDetail(captainId);
    return data;
  }


 
}
