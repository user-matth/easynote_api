import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";

interface JWTPayload {
    login: string;
    userid: number;
    iat: number;
    exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly refletctor: Reflector,
        private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext) {
        const roles = this.refletctor.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest();

        if (roles?.length) {
            const token = request.headers?.authorization?.split("Bearer ")[1];
            try {
                const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload;
                const user = await this.prismaService.user.findUnique({
                    where: {
                        login: payload.login
                    }
                })
                if (!user) return false;
                request.user = user;
                if (roles.includes(user.role)) return true;
                return false;
            } catch (error) {
                return false;
            }
        } else {
            const token = request.headers?.authorization?.split("Bearer ")[1];
            const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload;
            const user = await this.prismaService.user.findUnique({
                where: {
                    login: payload.login
                }
            })
            if (!user) return false;
            request.userData = user;
            return true;
        }
        return true;
    }
}