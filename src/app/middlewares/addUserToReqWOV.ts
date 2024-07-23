import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../../modules/token/token.service';
import { isJWT } from 'class-validator';

@Injectable()
export class AddUserToReqWOV implements NestMiddleware
{
    constructor(private readonly tokenService: TokenService) {}

    async use(request: Request, response: Response, next: NextFunction)
    {
        const token = this.extractToken(request);
        if (!token) return next();

        try
        {
            const user = await this.tokenService.validateAccessToken(token);
            request.user = user;

        }
        catch  {}
        next();

    }

    protected extractToken(request: Request)
    {
        const authorization: string | undefined = request.headers.authorization;
        if (!authorization || authorization?.trim() === '')
        {
            return null;
        }

        const [ bearer, token ] = authorization.split(' ');

        if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token))
        {
            return null;
        }

        return token;
    }
}
