// Emergency reset (e.g. forgotten password): creates or overwrites the admin login.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm run admin:set
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars)');
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findFirst();
  if (existing) await prisma.adminUser.update({ where: { id: existing.id }, data: { email, passwordHash } });
  else await prisma.adminUser.create({ data: { email, passwordHash } });
  console.log(`Admin login set for ${email}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); }).finally(() => prisma.$disconnect());
