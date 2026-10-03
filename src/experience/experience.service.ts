import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.experience.findMany({ orderBy: { order: 'asc' } });
  }

  create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: { ...dto, startDate: new Date(dto.startDate), endDate: dto.endDate ? new Date(dto.endDate) : null },
    });
  }

  update(id: string, dto: UpdateExperienceDto) {
    return this.prisma.experience.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.experience.delete({ where: { id } });
  }
}
