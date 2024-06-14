import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isJWT } from 'class-validator';
import { Request } from 'express';
import { AuthMessage } from 'src/common/enums';
import { TokenService } from 'src/modules/token/token.service';
import { UserEntity } from '../models';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH } from 'src/common/decorators/skipAuth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private readonly tokenService: TokenService , private readonly reflector : Reflector) {}
   async canActivate(context: ExecutionContext) {

      // Skip Auth
      const isSkipedAuth = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler());
      if(isSkipedAuth) return true

      const httpContex = context.switchToHttp();
      const request: Request = httpContex.getRequest();

      const token = this.extractToken(request);

      // save user in Request.user
      request.user = (await this.tokenService.validateAccessToken(token)) as UserEntity;

      // return true;
      return true;
   }

   // Extract Token from Request
   protected extractToken(request: Request) {
      const authorization = request.headers.authorization;

      if (!authorization || authorization?.trim() == '') {
         throw new HttpException(AuthMessage.loginAgain, HttpStatus.UNAUTHORIZED);
      }

      const [bearer, token] = authorization?.split(' ');

      if (bearer?.toLowerCase() !== 'bearer' || !token || !isJWT(token)) {
         throw new HttpException(AuthMessage.loginAgain, HttpStatus.UNAUTHORIZED);
      }

      return token;
   }
}
