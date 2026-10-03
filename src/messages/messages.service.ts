import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(dto: CreateMessageDto) {
    return this.prisma.message.create({ data: dto });
  }

  markRead(id: string) {
    return this.prisma.message.update({ where: { id }, data: { read: true } });
  }

  remove(id: string) {
    return this.prisma.message.delete({ where: { id } });
  }
}
