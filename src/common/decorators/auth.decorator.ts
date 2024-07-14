import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../app/guards/auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export function AuthDecorator()
{
    return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth('Authorization'));
}
