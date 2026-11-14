import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { UpdateProfileDto } from '../anime/dto/update-profile.dto.js';
import type { Express } from 'express';
import type { UploadedAvatarFile } from '../storage/uploaded-avatar-file.type.js';
import { SupabaseStorageService } from '../storage/supabase-storage.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService, private readonly storageService: SupabaseStorageService) {}

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
    const user = await this.prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const uploaded = await this.storageService.uploadAvatar(
        userId,
        file,
    );

    try {
        const updatedUser = await this.prisma.user.update({
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

        return updatedUser;
    } catch (error) {
        await this.storageService.deleteAvatarByPath(uploaded.path);
        throw error;
    }
    }

}
