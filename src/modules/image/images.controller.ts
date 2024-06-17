import { ApiTags } from '@nestjs/swagger';
import { ImageDTO } from './dto/image.dto';
import { ImagesService } from './images.service';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';

@Controller('images')
@ApiTags('Image')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class ImagesController {
   constructor(private readonly imagesService: ImagesService) {}

   async Create(imageDto: ImageDTO) {
      return await this.imagesService.create(imageDto);
   }
}
