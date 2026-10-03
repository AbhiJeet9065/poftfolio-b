// One-off / idempotent: pushes the bundled portfolio assets into the Media table
// (Postgres bucket) and points the Profile at their URLs. Safe to re-run: files
// already uploaded (same filename) are reused instead of duplicated.
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const BASE = process.env.PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function upload(filename: string, mimeType: string) {
  const existing = await prisma.media.findFirst({ where: { filename }, select: { id: true } });
  if (existing) return `${BASE}/media/${existing.id}`;
  const data = readFileSync(fileURLToPath(new URL(`./assets/${filename}`, import.meta.url)));
  const media = await prisma.media.create({ data: { filename, mimeType, size: data.length, data: new Uint8Array(data) } });
  return `${BASE}/media/${media.id}`;
}

async function main() {
  const [photoUrl, aboutPhotoUrl, resumeUrl] = await Promise.all([
    upload('abhijeet-hero.jpg', 'image/jpeg'),
    upload('abhijeet-about.jpg', 'image/jpeg'),
    upload('Abhijeet_Khan_Resume.pdf', 'application/pdf'),
  ]);
  const profile = await prisma.profile.findFirst();
  if (!profile) throw new Error('No profile row — run the seed first');
  await prisma.profile.update({ where: { id: profile.id }, data: { photoUrl, aboutPhotoUrl, resumeUrl } });
  console.log({ photoUrl, aboutPhotoUrl, resumeUrl });
}

main().finally(() => prisma.$disconnect());
