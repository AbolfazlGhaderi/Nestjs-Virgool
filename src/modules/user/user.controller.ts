// import { ProfileImage } from '../../common/types';
// import {  MulterStorage } from '../../app/utils/multer.util';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { TCheckOtp } from './types/type';
import { UserService } from './user.service';
import { UserEntity } from '../../app/models';
import { ChangeOtpDto } from './dto/user.dto';
import { ProfileDto } from './dto/profile.dto';
import { PaginationDto } from '../../common/dtos';
import {  SwaggerConsumes } from '../../common/enums';
import { RoleKey } from '../../common/enums/role.enum';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { CanAccess } from '../../common/decorators/role.access.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';



@Controller('user')
@ApiTags('user')
@AuthDecorator()
export class UserController
{
    constructor(private readonly userService: UserService) {}

    @Put('/profile')
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
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
    async GetProfileC(): Promise<UserEntity>
    {
        return await this.userService.GetProfileS();
    }

    @Patch('change-email')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async ChangeEmailC(@Body() emailDTO: ChangeEmailDTO)
    {
        return await this.userService.ChangeEmailS(emailDTO);
    }

    @Get('verify-email')
    @HttpCode(HttpStatus.OK)
    async VerifyEmail()
    {
        return await this.userService.VerifyEmailS();
    }


    @Post('check-otp')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async CheckOtpC(@Body() cehckDTO: ChangeOtpDto): TCheckOtp
    {
        return await this.userService.CheckOtpS(cehckDTO);
    }

    @Patch('change-username')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async ChangeUserNameC(@Body() usernameDto: ChangeUserNameDTO)
    {
        return await this.userService.ChangeUserNameS(usernameDto);
    }

    @Get('/follow/:userId')
    @ApiParam({ name:'userId' })
    async FollowToggle(@Param('userId', ParseUUIDPipe) userId: string )
    {
        return await this.userService.FollowToggle(userId);
    }

    @Get('/list')
    @CanAccess(RoleKey.Admin)
    @Pagination()
    async GetAllUsers(@Query() paginationData: PaginationDto)
    {
        return await this.userService.GetAllUsers(paginationData);
    }

    @Get('/followers')
    @Pagination()
    async GetAllFollowers(@Query() paginationData: PaginationDto)
    {
        return await this.userService.GetAllFollowers(paginationData);
    }

    @Get('/following')
    @Pagination()
    async GetAllFollowing(@Query() paginationData: PaginationDto)
    {
        return await this.userService.GetAllFollowing(paginationData);
    }

}
