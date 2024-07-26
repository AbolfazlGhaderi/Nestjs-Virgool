import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('/auth/google')
@ApiTags('Google Oauth')
@UseGuards(AuthGuard('google'))
export class GoogleOauthController
{
    @Get()
    googleLogin(@Req() request:Request) {}

    @Get('/redirect')
    googleRedirect(@Req() request:Request)
    {
        return request.user;
    }
}