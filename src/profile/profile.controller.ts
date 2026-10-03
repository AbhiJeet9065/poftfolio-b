import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get()
  get() {
    return this.profile.get();
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Body() dto: UpdateProfileDto) {
    return this.profile.update(dto);
  }
}
