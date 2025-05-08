// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.createUser(dto);
    return this.authService.login(user);
  }

  @Get('me')
  async getProfile(@Request() req) {
    return await this.usersService.findById(req.user.userId);
  }
}
