import { Body, Controller, ParseFilePipe, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterDestination, MulterFileName } from 'src/app/utils/multer.util';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @ApiBearerAuth('Authorization')
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseGuards(AuthGuard)
  // Upload File (Setup FileFieldsInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image_profile', maxCount: 1 },
        { name: 'bg_image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: MulterDestination('user-profile'),
          filename: MulterFileName,
        }),
      },
    ),
  )
  UpdateProfileC(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
        fileIsRequired: false,
      }),
    )
    file: any,
    @Body() profileDto: ProfileDto,
  ) {
    console.log(file);
    return this.userService.UpdateProfileS(file, profileDto);
  }
}
