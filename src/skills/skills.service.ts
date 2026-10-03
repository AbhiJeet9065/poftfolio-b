import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSkillDto, UpdateSkillDto } from './dto/skill.dto.js';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.skill.findMany({ where: { visible: true }, orderBy: { order: 'asc' } });
  }

  create(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  update(id: string, dto: UpdateSkillDto) {
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.skill.delete({ where: { id } });
  }
}
