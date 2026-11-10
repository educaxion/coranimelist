import { from } from "rxjs";
import {
    IsString,
    IsOptional,
    IsInt,
    IsNumber,
    Min,
    Max,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class CreateAnimeDto {
    @IsString()
    @MaxLength(255)
    title!: string;

    @IsOptional()
    @IsString()
    titleNative?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    coverImage?: string;

    @IsOptional()
    @IsUrl()
    bannerImage?: string;

    @IsOptional()
    @IsString()
    format?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    episodes?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    duration?: number;

    @IsOptional()
    @IsString()
    season?: string;

    @IsOptional()
    @IsInt()
    @Min(1900)
    seasonYear?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    averageScore?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    popularity?: number;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsString()
    sourceId?: string;
}