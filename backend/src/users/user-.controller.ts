
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateProfileDto } from '../anime/dto/update-profile.dto.js';
import { UpdatePasswordDto } from '../anime/dto/update-password.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UploadedAvatarFile } from '../storage/uploaded-avatar-file.type.js';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    getProfile(@Req() req: AuthenticatedRequest) {
        return this.usersService.findById(req.user.sub);
    }

    @Patch('me')
    updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(req.user.sub, dto);
    }

    @Post('me/password')
    updatePassword(
        @Req() req: AuthenticatedRequest,
        @Body() dto: UpdatePasswordDto,
    ) {
        return this.usersService.updatePassword(
        req.user.sub,
        dto.password,
        );
    }

  
    @Post('me/avatar')
    @UseInterceptors(
    FileInterceptor('avatar', {
        limits: {
        fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (_req, file, callback) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
            new BadRequestException(
                'Only JPG, PNG, and WEBP images are allowed',
            ),
            false,
            );
        }

        callback(null, true);
        },
    }),
    )
    uploadAvatar(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: UploadedAvatarFile,
    ) {
    if (!file) {
        throw new BadRequestException('Avatar file is required');
    }

    return this.usersService.updateAvatar(req.user.sub, file);
    }

}
