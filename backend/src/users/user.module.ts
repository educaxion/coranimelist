import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { UsersService } from "./user.service.js";
import { StorageModule } from '../storage/storage.module.js';
import type { UploadedAvatarFile } from '../storage/uploaded-avatar-file.type.js';

@Module({
    imports: [PrismaModule, StorageModule],
    providers: [UsersService],
    exports: [UsersService],
})

export class UsersModule {}