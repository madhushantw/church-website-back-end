import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AccessTokenLoginDto } from './dto/access-token-login.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('login/access-token')
  loginWithAccessToken(@Body() data: AccessTokenLoginDto) {
    return this.authService.loginWithAccessToken(data.accessToken);
  }
}
