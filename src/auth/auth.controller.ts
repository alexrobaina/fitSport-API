import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log(1, dto);
    const user = await this.usersService.createUser(dto);
    return this.authService.login(user);
  }
}
