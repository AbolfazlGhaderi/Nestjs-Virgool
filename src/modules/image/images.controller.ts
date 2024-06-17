import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';
import { ImageDTO } from './dto/image.dto';

@Controller('images')
@ApiTags('Image')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@UseInterceptors(ResponseControllerInterceptor)
export class ImagesController {
   constructor(private readonly imagesService: ImagesService) {}

   async Create(imageDto: ImageDTO) {
      return await this.imagesService.create(imageDto);
   }
}
