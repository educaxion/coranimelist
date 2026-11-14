import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, MaxLength, IsIn, } from "class-validator";
import { Type } from 'class-transformer'

export class SearchAnimeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    query!: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    perPage: number = 10
}