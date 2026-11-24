import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { UpdateProfileDto } from '../anime/dto/update-profile.dto.js';
import type { UploadedAvatarFile } from '../storage/uploaded-avatar-file.type.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: SupabaseStorageService,
    ) {}

    async create(data: {
        username: string;
        email: string;
        passwordHash: string;
    }) {
        return this.prisma.user.create({
        data,
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            createdAt: true,
        },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
        where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
        },
        });
    }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
        where: { username },
        });
    }

    async addFavorite(userId: string, animeId: string) {
        const anime = await this.prisma.anime.findUnique({
            where: { id: animeId },
        })

        if(!anime) {
            throw new NotFoundException('Anime Not Found')
        }

        return this.prisma.favorite.upsert({
            where: {
                userId_animeId: {
                    userId,
                    animeId
                }
            },
            create: {
                userId,
                animeId,
            },
            update: {},
            include: {
                anime: {
                    select: {
                        id: true,
                        sourceId: true,
                        title: true,
                        titleNative: true,
                        coverImage: true,
                        format: true,
                        averageScore: true,
                        episodes: true,
                        seasonYear: true
                    }
                }
            }
        })
    }

    async removeFavorite(userId: string, animeId: string) {
        await this.prisma.favorite.deleteMany({
            where: {
                userId,
                animeId,
            }
        })

        return {
            message: 'Anime removed from favorites'
        }
    }

    async getFavorites(userId: string) {
        return this.prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                anime: {
                    select: {
                        id: true,
                        sourceId: true,
                        title: true,
                        titleNative: true,
                        coverImage: true,
                        format: true,
                        averageScore: true,
                        episodes: true,
                        seasonYear: true
                    }
                }
            }
        })
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const data: {
            username?: string;
            email?: string;
            bio?: string | null;
        } = {};

        if (dto.username !== undefined) {
        data.username = dto.username.trim().toLowerCase();

        const existingUsername = await this.findByUsername(data.username);

        if (existingUsername && existingUsername.id !== userId) {
            throw new ConflictException('Username is already taken');
        }
        }

        if (dto.email !== undefined) {
        data.email = dto.email.trim().toLowerCase();

        const existingEmail = await this.findByEmail(data.email);

        if (existingEmail && existingEmail.id !== userId) {
            throw new ConflictException('Email is already registered');
        }
        }

        if (dto.bio !== undefined) {
        data.bio = dto.bio.trim() || null;
        }

        return this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updatePassword(userId: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        return { message: 'Password updated successfully' };
    }

    async updateAvatar(userId: string, file: UploadedAvatarFile) {
        // 1. Ambil avatar lama dari database
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const oldAvatarPath = user.avatar
        ? this.storageService.getAvatarPathFromPublicUrl(
            user.avatar,
            userId,
            )
        : null;

        // 2. Upload avatar baru
        const uploaded = await this.storageService.uploadAvatar(
            userId,
            file,
        );

        let updatedUser;

        try {
        // 3. Update avatar di database
        updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
            avatar: uploaded.url,
            },
            select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
            },
        });
        } catch (error) {
        // 4. Rollback: hapus avatar baru jika database gagal
        try {
            await this.storageService.deleteAvatarByPath(
            uploaded.path,
            );
        } catch (cleanupError) {
            this.logger.error(
            'Failed to clean up newly uploaded avatar',
            cleanupError instanceof Error
                ? cleanupError.stack
                : String(cleanupError),
            );
        }

        throw error;
        }

        // 5. Hapus avatar lama setelah database berhasil diperbarui
        if (oldAvatarPath && oldAvatarPath !== uploaded.path) {
        try {
            await this.storageService.deleteAvatarByPath(
            oldAvatarPath,
            );
        } catch (error) {
            this.logger.warn(
            `Failed to delete old avatar for user ${userId}: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
        }

        return updatedUser;
    }

    async addWatchlist(userId: string, animeId: string) {
        const anime = await this.prisma.anime.findUnique({
            where: { id: animeId }
        })

        if(!anime){
            throw new NotFoundException('Anime not found')
        }

        return this.prisma.userAnime.upsert({
            where: {
                userId_animeId: {
                    userId,
                    animeId,
                }
            },
            create: {
                userId,
                animeId,
                status: 'PLANNING'
            },
            update: {},
            include: {
                anime: {
                    select: {
                        id: true,
                        sourceId: true,
                        title: true,
                        titleNative: true,
                        coverImage: true,
                        format: true,
                        averageScore: true,
                        episodes: true,
                        seasonYear: true
                    }
                }
            }
        })
    }

    async getWatchlist(userId: string) {
        return this.prisma.userAnime.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                anime: {
                    select: {
                        id: true,
                        title: true,
                        sourceId: true,
                        titleNative: true,
                        coverImage: true,
                        format: true,
                        averageScore: true,
                        episodes: true,
                        seasonYear: true,
                    }
                }
            }
        })
    }

    async updateWatchlist(
        userId: string, 
        animeId: string,
        status: 'WATCHING' | 'COMPLETED' | 'PLANNING' | 'PAUSED' | 'DROPPED'
    ) {
        const watchlist = await this.prisma.userAnime.findUnique({
            where: {
                userId_animeId: {
                    userId,
                    animeId,
                }
            }
        })

        if(!watchlist) {
            throw new NotFoundException('Anime not found in watchlist')
        }

        return this.prisma.userAnime.update({
            where: {
                userId_animeId: {
                    userId,
                    animeId,
                }
            },
            data: { status },
            include: {
                anime: {
                    select: {
                        id: true,
                        title: true,
                        sourceId: true,
                        titleNative: true,
                        coverImage: true,
                        format: true,
                        averageScore: true,
                        episodes: true,
                        seasonYear: true,
                    }
                }
            }
        })
    }

    async removeFromWatchlist(userId: string, animeId: string) {
        const result = await this.prisma.userAnime.deleteMany({
            where: {
                userId,
                animeId,
            }
        })

        if (result.count === 0) {
            throw new NotFoundException('Anime not found in watchlist')
        }

        return {
            message: 'Anime removed from watchlist'
        }
    }

    async getProfileCollections(userId: string) {
        const [favorites, watchlist, reviews] = await Promise.all([
            this.prisma.favorite.findMany({
                where: {userId},
                orderBy: {createdAt: 'desc'},
                include: {
                    anime: {
                        select: {
                            id: true,
                            sourceId: true,
                            title: true,
                            titleNative: true,
                            coverImage: true,
                            format: true,
                            averageScore: true,
                            episodes: true,
                            seasonYear: true,
                        }
                    }
                }
            }),

            this.prisma.userAnime.findMany({
                where: {userId},
                orderBy: {createdAt: 'desc'},
                include: {
                    anime: {
                        select: {
                            id: true,
                            sourceId: true,
                            title: true,
                            titleNative: true,
                            coverImage: true,
                            format: true,
                            averageScore: true,
                            episodes: true,
                            seasonYear: true,
                        }
                    }
                }
            }),

            this.prisma.review.findMany({
                where: {userId},
                orderBy: {createdAt: 'desc'},
                include: {
                    anime: {
                        select: {
                            id: true,
                            sourceId: true,
                            title: true,
                            titleNative: true,
                            coverImage: true,
                            format: true,
                            averageScore: true,
                            episodes: true,
                            seasonYear: true,
                        }
                    }
                }
            })
        ])

        return {
            favorites,
            watchlist,
            reviews,
        }
    }

    async createReview(
        userId: string,
        animeId: string,
        content: string
    ) {
        const anime = await this.prisma.anime.findUnique({
            where: {id:animeId}
        })

        if(!anime) {
            throw new NotFoundException('Anime not found')
        }

        const trimmedContent = content.trim()

        if(!trimmedContent) {
            throw new BadRequestException('Comment cannot be empty')
        }

        return this.prisma.review.upsert({
            where: {
                userId_animeId: {
                    userId, 
                    animeId
                },
            },
            create: {
                userId,
                animeId, 
                title: anime.title,
                content: trimmedContent
            },
            update: {
                content: trimmedContent
            },
            include: {
                anime: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        }) 
    }

    async removeReview(userId: string, animeId: string){
        const result = await this.prisma.review.deleteMany({
            where: {
                userId,
                animeId
            }
        })

        if(result.count === 0) {
            throw new NotFoundException('Review not found')
        }

        return {
            message: 'Review deleted successfully'
        }
    }
}
