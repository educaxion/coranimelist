import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcryptjs'
import { UsersService } from "../users/user.service.js"
import { RegisterDto } from "./dto/register.dto.js"
import { LoginDto } from "./dto/login.dto.js"

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    
    async register(registerDto: RegisterDto) {
        const username = registerDto.username.trim().toLowerCase()
        const email = registerDto.email.trim().toLowerCase();

        const existingEmail = await this.usersService.findByEmail(email)
        if(existingEmail) {
            throw new ConflictException('Email is alredy registered')
        }

        const existingUsername = await this.usersService.findByUsername(username)
        if(existingUsername) {
            throw new ConflictException('Username is alredy taken')
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 12)

        const user = await this.usersService.create({
            username, email, passwordHash
        })

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        })

        return { user, accessToken }
    }

    async login(loginDto: LoginDto) {
        const email = loginDto.email.trim().toLowerCase()
        const user = await this.usersService.findByEmail(email)

        if(!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const passwordIsValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        )
        if(!passwordIsValid) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email
        })

        const { passwordHash, ...safeUser } = user

        return {
            user: safeUser,
            accessToken
        }
    }

    async getProfile(userId: string){
        const user = await this.usersService.findById(userId)
        if(!user){
            throw new UnauthorizedException("User no longer exist")
        }
        return user
    }
}