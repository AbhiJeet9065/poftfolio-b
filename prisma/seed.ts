import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: 'Abhijeet Khan',
      headline: 'FULL-STACK ENGINEER. SHIPPED SOLO. SHIPPED AT SCALE.',
      bio: 'Full-stack engineer with 2+ years of production experience at CircleChess across web, mobile, and backend, with a strong focus on performance and monitoring. Outside work, built and shipped products solo, including a B2B omnichannel customer service platform and a delivery app live on the Play Store.',
      location: 'Bengaluru, India',
      openToWork: true,
      linkedin: 'https://linkedin.com/in/abhijeetkhan',
      github: 'https://github.com/AbhiJeet9065',
      email: 'abhijeetkhan28@gmail.com',
    },
  });

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { label: 'Years in production', value: '2+', order: 0 },
      { label: 'Lighthouse score (from 30)', value: '90', order: 1 },
      { label: 'MTTR reduction', value: '45%', order: 2 },
      { label: 'Bugs surfaced via monitoring', value: '40+', order: 3 },
      { label: 'Products shipped solo', value: '4', order: 4 },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: 'CircleChess',
        role: 'Software Developer',
        startDate: new Date('2024-06-01'),
        endDate: null,
        bullets: [
          'Rebuilt the Tournaments page in Next.js (moved off React Native) with SSR and Redis caching, taking its Lighthouse performance score from 30 to 90 and SEO score to 99.',
          'Moved static assets to S3 with CloudFront delivery for faster page loads, and added automated cache invalidation to the deploy process so releases don’t serve stale files.',
          'Owned the post-class feedback system end to end: scoped it with the coaching team, built the Django REST APIs and WhatsApp Flows integration, tested and shipped it. Structured feedback collection rose 40%.',
          'Built A/B testing with PostHog and Next.js; an admin dashboard swaps S3-hosted variant configs in under 60 seconds with no redeploy.',
          'Replaced Sentry with self-hosted GlitchTip across the Next.js and React Native apps. Alerts surfaced 40+ production bugs, MTTR dropped 45%, and the paid monitoring bill went to zero.',
          'Shipped Beginner’s Mode, pairing low-rated players with matching bots (~50% higher retention), and push notifications for iOS and Android (+20% return visits).',
          'Added multi-puzzle support and a real-time move indicator to Assignments using chess.js and FEN/PGN handling, raising puzzle completion 40% and cutting drop-offs 35%.',
        ],
        order: 0,
      },
    ],
  });

  await prisma.skill.deleteMany();
  const skills: [string, string][] = [
    // Languages
    ['Python', 'Languages'],
    ['JavaScript', 'Languages'],
    ['TypeScript', 'Languages'],
    ['HTML', 'Languages'],
    ['CSS', 'Languages'],
    // Frontend & Mobile
    ['React', 'Frontend'],
    ['Next.js', 'Frontend'],
    ['React Native', 'Frontend'],
    ['Expo', 'Frontend'],
    ['Zustand', 'Frontend'],
    ['TanStack Query', 'Frontend'],
    ['Tailwind CSS', 'Frontend'],
    // Backend & Data
    ['Django', 'Backend'],
    ['FastAPI', 'Backend'],
    ['Node.js', 'Backend'],
    ['REST APIs', 'Backend'],
    ['Celery', 'Backend'],
    ['JWT Auth', 'Backend'],
    ['PostgreSQL', 'Backend'],
    ['MongoDB', 'Backend'],
    ['Redis', 'Backend'],
    ['Firebase', 'Backend'],
    // Cloud & DevOps
    ['AWS S3 & CloudFront', 'Cloud & DevOps'],
    ['CI/CD', 'Cloud & DevOps'],
    ['Vercel', 'Cloud & DevOps'],
    ['Git', 'Cloud & DevOps'],
    ['Linux', 'Cloud & DevOps'],
    // Product & Quality
    ['PostHog A/B Testing', 'Product & Quality'],
    ['GlitchTip Monitoring', 'Product & Quality'],
    ['Lighthouse / Core Web Vitals', 'Product & Quality'],
    ['Technical SEO', 'Product & Quality'],
    ['LLM APIs (Groq)', 'Product & Quality'],
  ];
  await prisma.skill.createMany({
    data: skills.map(([name, category], order) => ({ name, category, order, visible: true })),
  });

  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: 'Connect',
        slug: 'connect',
        coverImage: '',
        gallery: [],
        techTags: ['Next.js', 'WhatsApp API', 'Multi-channel'],
        summary: 'B2B omnichannel customer service platform',
        caseStudy:
          'Designed and built solo: businesses manage customer conversations across WhatsApp, Instagram, email, and calls, and run campaigns, from one workspace.',
        featured: true,
        order: 0,
      },
      {
        title: 'PickHere',
        slug: 'pickhere',
        coverImage: '',
        gallery: [],
        techTags: ['React Native', 'REST APIs', 'WhatsApp Chatbot', 'Push Notifications'],
        summary: 'Neighbourhood delivery app, live on the Play Store',
        caseStudy:
          'Built solo and shipped to the Play Store: mobile app, WhatsApp chatbot backend for service requests, and admin dashboard for delivery ops; order handling time fell 30%.',
        featured: true,
        order: 1,
      },
      {
        title: 'IntentRadar',
        slug: 'intentradar',
        coverImage: '',
        gallery: [],
        techTags: ['Next.js', 'FastAPI', 'PostgreSQL', 'Celery', 'Redis', 'Groq LLM', 'Razorpay'],
        summary: 'B2B lead generation SaaS',
        caseStudy:
          'Multi-tenant SaaS that scans Hacker News, Stack Overflow, GitHub, and Reddit, using LLMs to score 500+ posts/day for buyer intent and draft outreach. Celery + Redis pipeline runs every 15 minutes and delivers leads to 4 channels in under 60s. Razorpay billing across 4 tiers, org-scoped API keys, and 3-role RBAC.',
        featured: true,
        order: 2,
      },
      {
        title: 'BuildNApply',
        slug: 'buildnapply',
        coverImage: '',
        gallery: [],
        techTags: ['FastAPI', 'React', 'JWT', 'PostgreSQL'],
        summary: 'Resume & ATS platform',
        caseStudy:
          'FastAPI + React app with JWT auth and PostgreSQL that scores resumes (PDF, DOCX, TXT) against job descriptions, flags keyword gaps, and aggregates jobs from 5+ sources into a Kanban tracker.',
        featured: true,
        order: 3,
      },
    ],
  });

  // Create the admin only if none exists, so re-seeding never resets a password you changed.
  // Credentials come from the environment — nothing is hardcoded in the repo.
  if ((await prisma.adminUser.count()) === 0) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 10) {
      throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) in .env to create the first admin');
    }
    await prisma.adminUser.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) } });
  }

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
