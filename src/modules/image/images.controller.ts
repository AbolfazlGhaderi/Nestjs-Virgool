import { ImageDTO } from './dto/image.dto';
import { ImagesService } from './images.service';
import { SwaggerConsumes } from 'src/common/enums';
import { MulterFile } from 'src/app/utils/multer.util';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { UploadeImageInterceptor } from 'src/app/interceptors/uploade.interceptor';
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';

@Controller('image')
@ApiTags('Image')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class ImagesController {
   constructor(private readonly imagesService: ImagesService) {}

   @Post('/image')
   @ApiConsumes(SwaggerConsumes.MultipartData)
   @UseInterceptors(UploadeImageInterceptor('image', 'images'))
   async Save(@Body() imageDto: ImageDTO, @UploadedFile() file: MulterFile) {
      
      return await this.imagesService.Save(imageDto, file);

   }
}
