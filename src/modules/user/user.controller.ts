import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseGuards(AuthGuard)
  UpdateProfileC(@Body() profileDto : ProfileDto){

    return this.userService.UpdateProfileS(profileDto)
  }
}
