import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangeCredentialsDto } from './dto/change-credentials.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-credentials')
  changeCredentials(@Req() req: { user: { userId: string } }, @Body() dto: ChangeCredentialsDto) {
    return this.auth.changeCredentials(req.user.userId, dto);
  }
}
