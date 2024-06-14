import { BlogService } from './blog.service';
import { PaginationDto } from 'src/common/dtos';
import { Pagination } from 'src/common/decorators';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CreateBlogDto } from './dto/create.blog.dto';
import { PublicMessage, SwaggerConsumes } from 'src/common/enums';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SkipAuthDecorator } from 'src/common/decorators/skipAuth.decorator';
import { ResponseControllerInterceptor } from 'src/app/interceptors/response.controller.interceptor';
import { Body, Controller, Post, UseGuards, HttpStatus, HttpCode, Get, UseInterceptors, Query } from '@nestjs/common';

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
