import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

const DEFAULTS = {
  name: 'Abhijeet Khan',
  headline: 'I BUILD FAST WEB. I OWN THE OUTCOME.',
  bio: 'Frontend Developer based in Jamshedpur, India.',
  location: 'Jamshedpur, India',
};

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const existing = await this.prisma.profile.findFirst();
    return existing ?? this.prisma.profile.create({ data: DEFAULTS });
  }

  async update(dto: UpdateProfileDto) {
    const existing = await this.get();
    return this.prisma.profile.update({ where: { id: existing.id }, data: dto });
  }
}
