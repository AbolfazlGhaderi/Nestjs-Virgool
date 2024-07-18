// import { ProfileImage } from '../../common/types';
// import {  MulterStorage } from '../../app/utils/multer.util';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UserEntity } from '../../app/models';
import { ProfileDto } from './dto/profile.dto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import {  SwaggerConsumes } from '../../common/enums';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { TChangeEmailC, TCheckOtp } from './types/type';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, ParseFilePipe, Patch, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';



@Controller('user')
@ApiTags('user')
export class UserController
{
    constructor(private readonly userService: UserService) {}

    @Put('/profile')
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    @AuthDecorator()
    // Upload File (Setup FileFieldsInterceptor)
    // @UseInterceptors(
    // FileFieldsInterceptor(
    //     [
    //         { name: 'image_profile', maxCount: 1 },
    //         { name: 'bg_image', maxCount: 1 },
    //     ],
    //     {
    //         storage: MulterStorage('user-profile'),
    //     },
    // ),
    // )
    async UpdateProfileC(
        // @UploadedFiles(
        //     new ParseFilePipe({
        //         validators: [],
        //         fileIsRequired: false,
        //     }),
        // )
        //     file: ProfileImage,
        @Body() profileDto: ProfileDto,
    )
    {
        return  await this.userService.UpdateProfileS( profileDto);

    }

    @Get('profile')
    @HttpCode(HttpStatus.OK)
    @AuthDecorator()
    async GetProfileC(): Promise<UserEntity>
    {
        return await this.userService.GetProfileS();
    }

    @Patch('change-email')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    @AuthDecorator()
    async ChangeEmailC(@Body() emailDTO: ChangeEmailDTO): TChangeEmailC
    {
        return await this.userService.ChangeEmailS(emailDTO);
    }

    @Post('check-otp')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    @AuthDecorator()
    async checkOtpC(@Body() cehckDTO: CheckOtpDto): TCheckOtp
    {
        return await this.userService.checkOtpS(cehckDTO);
    }

    @Patch('change-username')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    @AuthDecorator()
    async changeUserNameC(@Body() usernameDto: ChangeUserNameDTO)
    {
        return await this.userService.changeUserNameS(usernameDto);
    }
}
