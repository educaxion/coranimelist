import { IsEmail, IsString, MinLength, MaxLength, Max } from "class-validator";

export class LoginDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password!: string
}