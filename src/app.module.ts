import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProfileModule } from './profile/profile.module.js';
import { StatsModule } from './stats/stats.module.js';
import { ExperienceModule } from './experience/experience.module.js';
import { SkillsModule } from './skills/skills.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { MediaModule } from './media/media.module.js';
import { VisitsModule } from './visits/visits.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    StatsModule,
    ExperienceModule,
    SkillsModule,
    ProjectsModule,
    MessagesModule,
    SettingsModule,
    MediaModule,
    VisitsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
