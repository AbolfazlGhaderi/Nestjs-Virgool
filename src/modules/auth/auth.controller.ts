import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { CheckOtpDto } from './dto/otp.dto';
import { AuthService } from './auth.service';
import { SwaggerConsumes } from 'src/common/enums';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('user-existence')
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   async userExistenceC(@Body() auhtDto: AuthDto, @Res({ passthrough: true }) response: Response) {
      return await this.authService.userExistenceS(auhtDto, response);
   }

   @Post('check-otp')
   @HttpCode(HttpStatus.OK)
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   async checkOtpC(@Body() checkOtpDto: CheckOtpDto, @Res({ passthrough: true }) response: Response) {
      return await this.authService.checkOtpS(checkOtpDto.code);
   }

   @Get('check-login')
   @HttpCode(HttpStatus.OK)
   @ApiBearerAuth('Authorization')
   @UseGuards(AuthGuard)
   async checkLoginC(@Req() request: Request) {
      return request.user;
   }
}
