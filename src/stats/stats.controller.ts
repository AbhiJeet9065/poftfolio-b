import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { StatsService } from './stats.service.js';
import { CreateStatDto, UpdateStatDto } from './dto/stat.dto.js';

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get()
  list() {
    return this.stats.list();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateStatDto) {
    return this.stats.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStatDto) {
    return this.stats.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stats.remove(id);
  }
}
