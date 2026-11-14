import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller.js';
import { AnimeService } from './anime.service.js';
import { AniListService } from './anilist.service.js';

@Module({
  controllers: [AnimeController],
  providers: [AnimeService, AniListService],
})
export class AnimeModule {}