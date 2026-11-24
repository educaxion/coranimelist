import { Injectable, InternalServerErrorException,} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import type { UploadedAvatarFile } from './uploaded-avatar-file.type.js';

@Injectable()
export class SupabaseStorageService {
    private readonly supabase: SupabaseClient;
    private readonly bucket = 'avatars';

    constructor(private readonly configService: ConfigService) {
        this.supabase = createClient(
        this.configService.getOrThrow<string>('SUPABASE_URL'),
        this.configService.getOrThrow<string>('SUPABASE_SECRET_KEY'),
        );
    }

    // Upload avatar baru
    async uploadAvatar(userId: string, file: UploadedAvatarFile) {
        const extension = extname(file.originalname).toLowerCase();
        const filePath = `${userId}/${randomUUID()}${extension}`;

        const { error } = await this.supabase.storage
        .from(this.bucket)
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

        if (error) {
        throw new InternalServerErrorException(error.message);
        }

        const { data } = this.supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

        return {
        url: data.publicUrl,
        path: filePath,
        };
    }

    // Mengambil dan memvalidasi path avatar dari URL
    getAvatarPathFromPublicUrl(
        publicUrl: string,
        userId: string,
    ): string | null {
        try {
        const avatarUrl = new URL(publicUrl);

        const projectUrl = new URL(
            this.configService.getOrThrow<string>('SUPABASE_URL'),
        );

        // Pastikan URL berasal dari project Supabase kita
        if (avatarUrl.origin !== projectUrl.origin) {
            return null;
        }

        // Pastikan URL berasal dari bucket avatars
        const prefix = `/storage/v1/object/public/${this.bucket}/`;

        if (!avatarUrl.pathname.startsWith(prefix)) {
            return null;
        }

        // Ambil path file dari URL
        const encodedPath = avatarUrl.pathname.slice(prefix.length);
        const filePath = decodeURIComponent(encodedPath);

        // Pastikan file berada di folder milik user
        if (!filePath.startsWith(`${userId}/`)) {
            return null;
        }

        // Validasi setiap bagian path
        const segments = filePath.split('/');

        if (
            segments.some(
            (segment) =>
                !segment || segment === '.' || segment === '..',
            )
        ) {
            return null;
        }

        return filePath;
        } catch {
        return null;
        }
    }

    // Menghapus avatar berdasarkan path
    async deleteAvatarByPath(path: string) {
        const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path]);

        if (error) {
        throw new InternalServerErrorException(error.message);
        }
    }
}
