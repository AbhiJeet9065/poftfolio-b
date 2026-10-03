import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [visitors, agg] = await Promise.all([
      this.prisma.visitor.count(),
      this.prisma.visitor.aggregate({ _sum: { visits: true } }),
    ]);
    return { visitors, visits: agg._sum.visits ?? 0 };
  }

  /** Counts one visit for this browser (a new row the first time, +1 afterwards) and returns the totals. */
  async record(visitorId: string) {
    // Hash so the stored key can't be replayed as a client id.
    const id = createHash('sha256').update(visitorId).digest('hex');
    await this.prisma.visitor.upsert({
      where: { id },
      create: { id },
      update: { visits: { increment: 1 }, lastSeen: new Date() },
    });
    return this.stats();
  }
}
