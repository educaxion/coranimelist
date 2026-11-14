import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

    async deleteAvatarByPath(path: string) {
        const { error } = await this.supabase.storage
        .from(this.bucket)
        .remove([path]);

        if (error) {
        throw new InternalServerErrorException(error.message);
        }
    }
}
