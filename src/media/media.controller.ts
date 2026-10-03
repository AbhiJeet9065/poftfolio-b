import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { MediaService } from './media.service.js';

type UploadedImage = { originalname: string; mimetype: string; size: number; buffer: Buffer };

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'application/pdf'];

@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  /** Admin upload: stores the image in Postgres and returns the link to save on the record. */
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_BYTES },
      fileFilter: (_req, file, cb) =>
        ALLOWED.includes(file.mimetype)
          ? cb(null, true)
          : cb(new BadRequestException('Only images (JPEG, PNG, WebP, AVIF, GIF) or PDF files are allowed'), false),
    }),
  )
  async upload(@UploadedFile() file: UploadedImage | undefined, @Req() req: Request) {
    if (!file) throw new BadRequestException('No file uploaded (field name: "file")');
    const saved = await this.media.create(file);
    const base = process.env.PUBLIC_API_URL ?? `${req.protocol}://${req.get('host')}/api`;
    return { ...saved, url: `${base}/media/${saved.id}` };
  }

  @Get(':id')
  async serve(@Param('id') id: string, @Query('download') download: string | undefined, @Res() res: Response) {
    const media = await this.media.get(id);
    res.set({
      'Content-Type': media.mimeType,
      'Content-Length': String(media.size),
      // ?download=1 forces a save dialog (the <a download> attribute is ignored cross-origin)
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${encodeURIComponent(media.filename)}"`,
      // ids are immutable (a new upload gets a new id), so cache hard
      'Cache-Control': 'public, max-age=31536000, immutable',
      // frontend (different origin) embeds these images
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(Buffer.from(media.data));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.media.remove(id);
    return { ok: true };
  }
}
