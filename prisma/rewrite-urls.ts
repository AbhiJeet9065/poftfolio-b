// Re-points stored file links after the API moves (e.g. localhost -> your Render URL).
//   FROM=http://localhost:3001/api TO=https://your-api.onrender.com/api npm run prisma:rewrite-urls
// Touches Profile photo/about/resume and Project cover/gallery links that start with FROM.
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const FROM = process.env.FROM?.replace(/\/$/, '');
const TO = process.env.TO?.replace(/\/$/, '');
const swap = (v: string | null) => (v && FROM && TO && v.startsWith(FROM) ? TO + v.slice(FROM.length) : v);

async function main() {
  if (!FROM || !TO) throw new Error('Set FROM and TO (API base URLs, e.g. https://x.onrender.com/api)');
  let changed = 0;

  for (const p of await prisma.profile.findMany()) {
    const data = { photoUrl: swap(p.photoUrl), aboutPhotoUrl: swap(p.aboutPhotoUrl), resumeUrl: swap(p.resumeUrl) };
    if (data.photoUrl !== p.photoUrl || data.aboutPhotoUrl !== p.aboutPhotoUrl || data.resumeUrl !== p.resumeUrl) {
      await prisma.profile.update({ where: { id: p.id }, data });
      changed++;
    }
  }
  for (const p of await prisma.project.findMany()) {
    const coverImage = swap(p.coverImage) ?? '';
    const gallery = p.gallery.map((g) => swap(g) ?? g);
    if (coverImage !== p.coverImage || gallery.some((g, i) => g !== p.gallery[i])) {
      await prisma.project.update({ where: { id: p.id }, data: { coverImage, gallery } });
      changed++;
    }
  }
  console.log(`Updated ${changed} record(s): ${FROM} -> ${TO}`);
}

main().catch((e) => { console.error(e.message); process.exit(1); }).finally(() => prisma.$disconnect());
