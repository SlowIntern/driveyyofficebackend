import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { DeleteDto } from './dto/deleteUser.dto';
import { CreateCaptainDto } from './dto/capregister.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  // Normal user which book cap authentication setup
  @Post('register')
  async registerUser(@Body() dto: RegisterDto)
  {
    return await this.authService.register(dto);
  }


  @Post('login')
  async loginUser(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response 
  ) {

    console.log("The login data is", dto);
    const { user, token } = await this.authService.login(dto);

    
    response.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Login successful', user };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response)
  {
    const token =req.cookies?.token;
    await this.authService.logoutUser(token);
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
  }


  @Get('profile')
    @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;      //major bug here during connected socket because it is not returning the user
  }

  @Delete('deleteuser')
  async deleteUser(dto: DeleteDto)
  {
    return await this.authService.deleteUser(dto);
  }



  //--=-=-==--=-=-captain which is driver profile setup-=-=--=-=-=-=-=

  @Post('cap/register')
  async registercap(@Body() dto: CreateCaptainDto)
  {
    return await this.authService.registerCap(dto);
  }



}
