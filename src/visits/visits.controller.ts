import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsUUID } from 'class-validator';
import { VisitsService } from './visits.service.js';

class RecordVisitDto {
  @IsUUID() visitorId!: string;
}

@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Get()
  stats() {
    return this.visits.stats();
  }

  @Post()
  record(@Body() dto: RecordVisitDto) {
    return this.visits.record(dto.visitorId);
  }
}
