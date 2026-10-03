import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { SettingsService } from './settings.service.js';
import { UpsertSettingDto } from './dto/upsert-setting.dto.js';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  getAll() {
    return this.settings.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Body() dto: UpsertSettingDto) {
    return this.settings.upsert(dto);
  }
}
