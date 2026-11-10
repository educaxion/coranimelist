import { Body, Controller, Delete, Get, Patch, Post, Param, ParseUUIDPipe } from '@nestjs/common';
import { AnimeService } from './anime.service.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  findAll() {
    return this.animeService.findAll();
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
}