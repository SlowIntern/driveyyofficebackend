// roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/user/schema/user.schema';
import { ROLES_KEY } from './decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles || roles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new HttpException(
                'Unauthorized',
                HttpStatus.UNAUTHORIZED
            );
        }

        if (!roles.includes(user.role)) {
            throw new HttpException(
                'Access denied',
                HttpStatus.FORBIDDEN
            );
        }

        return true;
    }
}
