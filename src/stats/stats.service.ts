import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStatDto, UpdateStatDto } from './dto/stat.dto.js';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.stat.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateStatDto) {
    return this.prisma.stat.create({ data: dto });
  }

  update(id: string, dto: UpdateStatDto) {
    return this.prisma.stat.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.stat.delete({ where: { id } });
  }
}
