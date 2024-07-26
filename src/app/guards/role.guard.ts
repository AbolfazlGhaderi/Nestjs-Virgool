import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { RoleKey } from '../../common/enums/role.enum';
import { ForbiddenMessage } from '../../common/enums/message.enum';
import { ROLE_ACCESS } from '../../common/decorators/role.access.decorator';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../models';

@Injectable()
export class RoleGuard implements CanActivate
{
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext)
    {
        const roles = this.reflector.getAllAndOverride(ROLE_ACCESS, [ context.getHandler(), context.getClass() ]);

        if (!roles || roles.length === 0) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as UserEntity;
        const userRole = user.role || RoleKey.User;
        if (userRole === RoleKey.Admin) return true;

        if (roles.includes(userRole as RoleKey)) return true;

        throw new HttpException(ForbiddenMessage.RoleAcces, HttpStatus.FORBIDDEN);
    }
}
