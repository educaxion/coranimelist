import { Body, Controller, Post, Res, Get, Req, UseGuards } from "@nestjs/common";
import type { Response } from 'express';
import { AuthService } from "./auth.service.js";
import { RegisterDto } from "./dto/register.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { JwtAuthGuard } from "./guards/jwt-auth.guard.js";

interface AuthRequest extends Request {
    user: {
        sub: string
        email: string
    }
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    private setAuthCookie(res: Response, token: string) {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        })
    }
    
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.register(registerDto)

        this.setAuthCookie(res, result.accessToken)

        return {
            message: "Registration successful",
            user: result.user
        }
    }

    @Post('login')
    async login(
        @Body() LoginDto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(LoginDto)

        this.setAuthCookie(res, result.accessToken)

        return {
            message: "Login Successful",
            user: result.user,
        }
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: AuthRequest){
        return this.authService.getProfile(req.user.sub)
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

        return {
            message: "Logout successful"
        }
    }
}