import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.anime.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: { id },
    })

    if (!anime) {
      throw new NotFoundException('Anime Not Found')
    }

    return anime;
  }

  async create(createAnimeDto: CreateAnimeDto) {
    return this.prisma.anime.create({
      data: createAnimeDto,
    })
  }

  async update(id: string, updateAnimeDto: UpdateAnimeDto) {
    await this.findOne(id);

    return this.prisma.anime.update({
      where: {id},
      data: updateAnimeDto
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.anime.delete({
      where: { id },
    })
  }
}