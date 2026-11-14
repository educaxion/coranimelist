import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_]+$/, { 
        message: 'Username can only contain letters, numbers, and underscore',
    })
    username!: string

    @IsEmail()
    @MaxLength(255)
    email!: string

    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password!: string
}