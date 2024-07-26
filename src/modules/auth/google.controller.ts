import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GoogleUser } from './types/typesAndInterfaces';

@Controller('/auth/google')
@ApiTags('Google Oauth')
@UseGuards(AuthGuard('google'))
export class GoogleOauthController
{
    constructor(private readonly authService:AuthService)
    {}

    @Get()
    googleLogin(@Req() request:Request) {}

    @Get('/redirect')
    async googleRedirect(@Req() request:Request)
    {
        const user = request.user as GoogleUser;
        return await this.authService.GoogleRedirect(user);
    }
}