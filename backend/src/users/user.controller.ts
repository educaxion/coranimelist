import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UpdateProfileDto } from '../anime/dto/update-profile.dto.js';
import { UpdatePasswordDto } from '../anime/dto/update-password.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateWatchlistStatusDto } from '../auth/dto/update-watchlist-status.js';
import { CreateReviewDto } from '../anime/dto/create-review.dto.js';
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

    @Get('me/favorites')
    getFavorites(@Req() req: AuthenticatedRequest) {
        return this.usersService.getFavorites(req.user.sub)
    }

    @Post('me/favorites/:animeId')
    addFavorite(
        @Req() req: AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
    ){
        return this.usersService.addFavorite(req.user.sub, animeId)
    }

    @Delete('me/favorites/:animeId')
    removeFavorite(
        @Req() req: AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
    ){
        return this.usersService.removeFavorite(req.user.sub, animeId)
    }

    @Get('me/watchlist')
    getWatchlist(@Req() req:AuthenticatedRequest) {
        return this.usersService.getWatchlist(req.user.sub)
    }

    @Post('me/watchlist/:animeId')
    addToWatchlist(
        @Req() req:AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
    ) {
        return this.usersService.addWatchlist(req.user.sub, animeId)
    }

    @Patch('me/watchlist/:animeId/status')
    updateWatchlistStatus(
        @Req() req: AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
        @Body() dto: updateWatchlistStatusDto
    ) {
        return this.usersService.updateWatchlist(
            req.user.sub,
            animeId,
            dto.status
        )
    }

    @Delete('me/watchlist/:animeId')
    removeFromWatchlist(
        @Req() req:AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
    ) {
        return this.usersService.removeFromWatchlist(req.user.sub, animeId)
    }

    @Get('me/collections')
    getProfileCollections(@Req() req: AuthenticatedRequest) {
        return this.usersService.getProfileCollections(req.user.sub)
    }

    @Post('me/reviews/:animeId')
    createReview(
        @Req() req: AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string,
        @Body() dto: CreateReviewDto
    ) {
        return this.usersService.createReview(
            req.user.sub,
            animeId,
            dto.content
        )
    }

    @Delete('me/reviews/:animeId')
    removeReview(
        @Req() req: AuthenticatedRequest,
        @Param('animeId', ParseUUIDPipe) animeId: string
    ) {
        return this.usersService.removeReview(
            req.user.sub,
            animeId
        )
    }
}
