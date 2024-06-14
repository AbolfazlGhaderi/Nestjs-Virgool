import { Body, Controller, Post, UseGuards, HttpStatus, HttpCode, Get, UseInterceptors, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create.blog.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PublicMessage, SwaggerConsumes } from 'src/common/enums';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';
import { Pagination } from 'src/common/decorators';
import { PaginationDto } from 'src/common/dtos';
import { SkipAuthDecorator } from 'src/common/decorators/skipAuth.decorator';

@Controller('blog')
@ApiTags(`Blog`)
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@UseInterceptors(ResponseControllerInterceptor)
export class BlogController {
   constructor(private readonly blogService: BlogService) {}

   @Post('/new-blog')
   @ApiConsumes(SwaggerConsumes.MultipartData, SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
   @HttpCode(HttpStatus.OK)
   async CreateBlogC(@Body() blogData: CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }> {
      return await this.blogService.CreateBlogS(blogData);
   }

   @Get('/')
   @HttpCode(HttpStatus.OK)
   @Pagination()
   @SkipAuthDecorator()
   async BlogList(@Query() paginationData: PaginationDto) {
      return await this.blogService.BlogList(paginationData);
   }

   @Get('/myblogs')
   @HttpCode(HttpStatus.OK)
   async myBlogs() {
      return await this.blogService.MyBlogs();
      // throw new HttpException("this is test",HttpStatus.NOT_FOUND)
   }
}
