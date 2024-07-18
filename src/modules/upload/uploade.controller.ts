// import { UploadeImageInterceptor } from 'src/app/interceptors/uploade.interceptor';
// import { MulterFile, MulterStorage } from 'src/app/utils/multer.util';

import { memoryStorage } from 'multer';
import { ImageDTO } from './dto/image.dto';
import { UploadeService } from './uploade.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { SwaggerConsumes } from '../../common/enums';
import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResponseControllerInterceptor } from '../../app/interceptors/response.controller.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { SKIP_AUTH, SkipAuthDecorator } from '../../common/decorators/skipAuth.decorator';

const storage = memoryStorage();
@Controller('upload')
@ApiTags('Upload')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class UploadeController
{
    constructor(private readonly uploadeService: UploadeService) {}

   @Post('/image')
   @ApiConsumes(SwaggerConsumes.MultipartData)
   // @UseInterceptors(UploadeImageInterceptor('image', ImageFolderNameEnum.Blogs))
   @UseInterceptors(FileInterceptor('image', { storage: storage }))
    async SaveImageBlog(@Body() imageDto: ImageDTO, @UploadedFile() file: Express.Multer.File)
    {
        return await this.uploadeService.uploadeImageBlog(imageDto, file); // TODO: Uploade => upload
    }

   @Post('/profile')
   @ApiConsumes(SwaggerConsumes.MultipartData)
   // @UseInterceptors(UploadeImageInterceptor('image', ImageFolderNameEnum.Blogs))
   @UseInterceptors(FileInterceptor('image', { storage: storage }))
   async SaveImageProfile(@Body() imageDto: ImageDTO, @UploadedFile() file: Express.Multer.File)
   {
       console.log(file);
       return await this.uploadeService.uploadImageProfile(file);
   }
}
