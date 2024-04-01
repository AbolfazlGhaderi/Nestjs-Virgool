import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user-existence')
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  async userExistenceC(@Body() auhtDto : AuthDto){
    return await this.authService.userExistenceS(auhtDto)

  }

}
