import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums';
import { Response } from 'express';
import { CheckOtpDto } from './dto/otp.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user-existence')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async userExistenceC(
    @Body() auhtDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.userExistenceS(auhtDto, response);
  }

  @Post('check-otp')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async checkOtpC(
    @Body() checkOtpDto: CheckOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.checkOtpS(checkOtpDto.code);
  }
}
