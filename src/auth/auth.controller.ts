import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Стартует сессию пользователя и выставляет Cookies
  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    return {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
    };
  }

  // Завершает сессию пользователя и удаляет Cookies
  @UseGuards(LocalAuthGuard)
  @Post('/auth/logout')
  logout(@Req() req: Request) {
    req.logout((err) => {
      if (err) {
        return err;
      }
    });
  }

  // Позволяет создать пользователя с ролью client в системе
  @Post('/client/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
