import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Cheap liveness check for Render's health check and the uptime monitor (no database call). */
  @Get('health')
  health() {
    return { status: 'ok', uptime: Math.round(process.uptime()) };
  }
}
