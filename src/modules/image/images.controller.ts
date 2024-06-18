// import { UploadeImageInterceptor } from 'src/app/interceptors/uploade.interceptor';
// import { MulterFile, MulterStorage } from 'src/app/utils/multer.util';

import { memoryStorage } from 'multer';
import { ImageDTO } from './dto/image.dto';
import { ImagesService } from './images.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsumes } from 'src/common/enums';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

const storage = memoryStorage();
@Controller('image')
@ApiTags('Image')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class ImagesController {
   constructor(private readonly imagesService: ImagesService) {}

   @Post('/image')
   @ApiConsumes(SwaggerConsumes.MultipartData)
   // @UseInterceptors(UploadeImageInterceptor('image', ImageFolderNameEnum.Blogs))
   @UseInterceptors(FileInterceptor('image', { storage: storage }))
   async SaveImageBlog(@Body() imageDto: ImageDTO, @UploadedFile() file: Express.Multer.File) {
      return await this.imagesService.SaveImageBlog(imageDto, file);
   }
}
