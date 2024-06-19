// import { UploadeImageInterceptor } from 'src/app/interceptors/uploade.interceptor';
// import { MulterFile, MulterStorage } from 'src/app/utils/multer.util';

import { memoryStorage } from 'multer';
import { ImageDTO } from './dto/image.dto';
import { UploadeService } from './uploade.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsumes } from 'src/common/enums';
import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { SKIP_AUTH, SkipAuthDecorator } from 'src/common/decorators/skipAuth.decorator';

const storage = memoryStorage();
@Controller('uploade')
@ApiTags('Uploade')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class UploadeController {
   constructor(private readonly uploadeService: UploadeService) {}

   @Post('/image')
   @ApiConsumes(SwaggerConsumes.MultipartData)
   // @UseInterceptors(UploadeImageInterceptor('image', ImageFolderNameEnum.Blogs))
   @UseInterceptors(FileInterceptor('image', { storage: storage }))
   async SaveImageBlog(@Body() imageDto: ImageDTO, @UploadedFile() file: Express.Multer.File) {
      return await this.uploadeService.UploadeImage(imageDto, file);
   }

   // @Get('/')
   // @SkipAuthDecorator()
   // async ShowFiles(){
   //    return await this.imagesService.ShowFiles();
   // }
}
