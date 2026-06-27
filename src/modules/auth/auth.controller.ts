import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'

import { AuthDecorator } from '../../common/decorators/auth.decorator'
import { CookieKeys, PublicMessage, SwaggerConsumes } from '../../common/enums'
import { AuthService } from './auth.service'
import { AuthDto, CheckRefreshTokenDto } from './dto/auth.dto'
import { CheckOtpDto } from './dto/otp.dto'

@Controller('auth')
@ApiTags('Auth')
export class AuthController
{
    constructor(private readonly authService: AuthService) {}

   @Post('user-existence')
   @HttpCode(HttpStatus.OK)
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async UserExistenceC(@Body() auhtDto: AuthDto, @Res({ passthrough: true }) response: Response)
    {
        const result = await this.authService.UserExistenceS(auhtDto)
        response.cookie(CookieKeys.OTP, result.token.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 1000, // 2 minutes
        })
        return result
    }

   @Post('check-otp')
   @HttpCode(HttpStatus.OK)
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   async CheckOtpC(@Body() checkOtpDto: CheckOtpDto, @Res({ passthrough: true }) response: Response)
   {
       const result = await this.authService.CheckOtpS(checkOtpDto.code)
       response.cookie(CookieKeys.AccessToken, result.accessToken.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 60 * 60 * 1000, // 1 hour
       })
       response.cookie(CookieKeys.RefreshToken, result.refreshToken.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 60 * 60 * 24 * 3 * 1000, // 3 days
       })
       return result
   }

   @Get('whoami')
   @HttpCode(HttpStatus.OK)
   @AuthDecorator()
   WhoAmI(@Req() request: Request)
   {
       return  request.user
   }

   @Post('/refresh-token')
   @HttpCode(HttpStatus.OK)
   CheckRefreshTokenC(@Body() refreshTokenData : CheckRefreshTokenDto, @Res({ passthrough: true }) response: Response)
   {
       const result = this.authService.CheckRefreahTokenS(refreshTokenData)
       response.cookie(CookieKeys.AccessToken, result.accessToken.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 60 * 60 * 1000, // 1 hour
       })
       response.cookie(CookieKeys.RefreshToken, result.refreshToken.token, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: 'strict',
           maxAge: 60 * 60 * 24 * 3 * 1000, // 3 days
       })
       return result
   }
}
