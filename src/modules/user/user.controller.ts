import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { ProfileImage } from 'src/common/types';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { SwaggerConsumes } from 'src/common/enums';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChangeEmailDTO } from './dto/change.email.dto';
import {  MulterStorage } from 'src/app/utils/multer.util';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, ParseFilePipe, Patch, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';

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
        storage: MulterStorage('user-profile'),
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
    file: ProfileImage,
    @Body() profileDto: ProfileDto,
  ) {

    return this.userService.UpdateProfileS(file, profileDto);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  async GetProfileC(): Promise<any> {
    return await this.userService.GetProfileS();
  }
  
  @Patch('change-email')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes(SwaggerConsumes.Json,SwaggerConsumes.UrlEncoded)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  async ChangeEmailC(@Body() emailDTO: ChangeEmailDTO): Promise<any> {
    return await  this.userService.ChangeEmailS(emailDTO)
  }

  @Post('check-otp')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes(SwaggerConsumes.Json,SwaggerConsumes.UrlEncoded)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  async checkOtpC(@Body() cehckDTO: CheckOtpDto): Promise<any> {
    return await  this.userService.checkOtpS(cehckDTO)
  }

  @Patch('change-username')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes(SwaggerConsumes.Json,SwaggerConsumes.UrlEncoded)
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  async changeUserNameC(@Body() usernameDto : ChangeUserNameDTO){
    return await this.userService.changeUserNameS(usernameDto)
     
  }
}
