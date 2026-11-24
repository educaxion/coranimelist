import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

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