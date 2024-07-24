import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../app/guards/auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../../app/guards/role.guard';

export function AuthDecorator()
{
    return applyDecorators(UseGuards(AuthGuard, RoleGuard), ApiBearerAuth('Authorization'));
}
