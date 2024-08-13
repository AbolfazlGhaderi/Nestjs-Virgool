import { Request, Response } from 'express';
import { CheckOtpDto } from './dto/otp.dto';
import { AuthService } from './auth.service';
import { PublicMessage, SwaggerConsumes } from '../../common/enums';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiResponseProperty, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckRefreshTokenDto } from './dto/auth.dto';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';

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
        return await this.authService.UserExistenceS(auhtDto);
    }

   @Post('check-otp')
   @HttpCode(HttpStatus.OK)
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   async CheckOtpC(@Body() checkOtpDto: CheckOtpDto) // @Res({ passthrough: true }) response: Response
   {
       return await this.authService.CheckOtpS(checkOtpDto.code);
   }

   @Get('whoami')
   @HttpCode(HttpStatus.OK)
   @AuthDecorator()
   WhoAmI(@Req() request: Request)
   {
       return  request.user;
   }

   @Post('/refresh-token')
   @HttpCode(HttpStatus.OK)
   CheckRefreshTokenC(@Body() refreshTokenData : CheckRefreshTokenDto)
   {
       return  this.authService.CheckRefreahTokenS(refreshTokenData);
   }
}
