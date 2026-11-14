import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { Observable } from "rxjs";

interface AuthenticatedRequest extends Request {
    user: {
        sub: string
        email: string
    }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

        const token = request.cookies?.access_token
        console.log('RAW COOKIE:', request.headers.cookie);
        console.log('PARSED COOKIES:', request.cookies);
        
        if(!token) {
            throw new UnauthorizedException("Authentication Required")
        }

        try {
            const payload = await this.jwtService.verifyAsync<{
                sub: string
                email: string
            }>(token)

            if(!payload.sub || !payload.email) {
                throw new UnauthorizedException("Invalid token payload")
            }
            request.user = payload
            return true

        }catch {
            throw new UnauthorizedException("Invalid or expired token")
        }


    } 
        
}