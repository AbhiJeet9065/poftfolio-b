import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChangeCredentialsDto } from './dto/change-credentials.dto.js';

const MAX_FAILS = 5;
const WINDOW_MS = 15 * 60 * 1000;

@Injectable()
export class AuthService {
  // Failed-login counters per email (in-memory: fine for one instance; use Redis if you scale out).
  private readonly fails = new Map<string, { count: number; first: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(user: { id: string; email: string }) {
    return this.jwt.signAsync({ sub: user.id, email: user.email });
  }

  async login(email: string, password: string) {
    const key = email.toLowerCase();
    const entry = this.fails.get(key);
    if (entry && Date.now() - entry.first > WINDOW_MS) this.fails.delete(key);
    if ((this.fails.get(key)?.count ?? 0) >= MAX_FAILS) {
      throw new HttpException('Too many failed attempts. Try again in 15 minutes.', HttpStatus.TOO_MANY_REQUESTS);
    }

    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) {
      const cur = this.fails.get(key) ?? { count: 0, first: Date.now() };
      this.fails.set(key, { count: cur.count + 1, first: cur.first });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.fails.delete(key);
    return { accessToken: await this.sign(user) };
  }

  /** Change the signed-in admin's email and/or password; requires the current password. */
  async changeCredentials(userId: string, dto: ChangeCredentialsDto) {
    if (!dto.newEmail && !dto.newPassword) throw new BadRequestException('Provide a new email and/or a new password');

    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.newEmail && dto.newEmail !== user.email) {
      const taken = await this.prisma.adminUser.findUnique({ where: { email: dto.newEmail } });
      if (taken) throw new ConflictException('That email is already in use');
    }

    const updated = await this.prisma.adminUser.update({
      where: { id: userId },
      data: {
        ...(dto.newEmail ? { email: dto.newEmail } : {}),
        ...(dto.newPassword ? { passwordHash: await bcrypt.hash(dto.newPassword, 12) } : {}),
      },
    });
    // Fresh token so the session survives an email change.
    return { accessToken: await this.sign(updated), email: updated.email };
  }
}
