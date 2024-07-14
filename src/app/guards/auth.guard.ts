import { Request } from 'express';
import { isJWT } from 'class-validator';
import { Reflector } from '@nestjs/core';
import { AuthMessage } from '../../common/enums';
import { TokenService } from '../../modules/token/token.service';
import { SKIP_AUTH } from '../../common/decorators/skipAuth.decorator';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate
{
    constructor(private readonly tokenService: TokenService, private readonly reflector : Reflector) {}
    async canActivate(context: ExecutionContext)
    {

        // Skip Auth
        const isSkipedAuth = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
        if (isSkipedAuth) return true;

        const httpContex = context.switchToHttp();
        const request: Request = httpContex.getRequest();

        const token = this.extractToken(request);

        // save user in Request.user
        request.user = (await this.tokenService.validateAccessToken(token));

        // return true;
        return true;
    }

    // Extract Token from Request
    protected extractToken(request: Request)
    {
        const authorization : string | undefined = request.headers.authorization;

        if (!authorization || authorization?.trim() === '')
        {
            throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
        }

        const [ bearer, token ] = authorization.split(' ');

        if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token))
        {
            throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
        }

        return token;
    }
}
