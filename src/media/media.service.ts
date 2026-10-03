import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  create(file: { originalname: string; mimetype: string; size: number; buffer: Buffer }) {
    return this.prisma.media.create({
      data: {
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        data: new Uint8Array(file.buffer),
      },
      select: { id: true, filename: true, mimeType: true, size: true },
    });
  }

  async get(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.media.delete({ where: { id } });
  }
}
