import { Body, Controller, Post, UseGuards, HttpStatus, HttpCode, Get, UseInterceptors, HttpException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create.blog.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerConfig } from 'src/configs';
import { PublicMessage, SwaggerConsumes } from 'src/common/enums';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { get } from 'node:http';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';

@Controller('blog')
@UseInterceptors(ResponseControllerInterceptor)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}


  @Post('/new-blog')
  @ApiConsumes(SwaggerConsumes.MultipartData,SwaggerConsumes.Json,SwaggerConsumes.UrlEncoded)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @HttpCode(HttpStatus.OK)
  async CreateBlogC(@Body() blogData:CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }>{

    return await this.blogService.CreateBlogS(blogData)
  }

  @Get('/all')
  async getAllBlogs(){
    return await this.blogService.getAllBlogs()
    // throw new HttpException("this is test",HttpStatus.NOT_FOUND)
  }
}
