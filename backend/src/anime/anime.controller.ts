import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';

import { AnimeService } from './anime.service.js';
import { AniListService } from './anilist.service.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';
import { SearchAnimeDto } from './dto/search-anime.dto.js';
import { SyncAnimeDto } from './dto/sync-anime.dto.js';
import { parse } from 'path';

@Controller('anime')
export class AnimeController {
  constructor(
    private readonly animeService: AnimeService,
    private readonly aniListService: AniListService,
  ) {}

  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get('search')
  searchAnime(@Query() searchAnimeDto: SearchAnimeDto) {
    return this.aniListService.searchAnime(
      searchAnimeDto.query,
      searchAnimeDto.page,
      searchAnimeDto.perPage,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.animeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnimeDto: UpdateAnimeDto,
  ) {
    return this.animeService.update(id, updateAnimeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.animeService.remove(id);
  }

  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Post('sync')
  syncAnime(@Body() syncAnimeDto: SyncAnimeDto) {
    return this.animeService.findOrCreate(syncAnimeDto)
  }

  @Get(':id/reviews')
  findReviews(
    @Param('id', ParseUUIDPipe) id:string
  ) {
    return this.animeService.findReviews(id)
  }
}
