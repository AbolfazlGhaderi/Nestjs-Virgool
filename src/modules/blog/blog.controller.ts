import { BlogService } from './blog.service';
import { PaginationDto } from '../../common/dtos';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { PublicMessage, SwaggerConsumes } from '../../common/enums';
import { FilterBlog } from '../../common/decorators/filter.decorator';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { SkipAuthDecorator } from '../../common/decorators/skipAuth.decorator';
import { ResponseControllerInterceptor } from '../../app/interceptors/response.controller.interceptor';
import { Body, Controller, Post, HttpStatus, HttpCode, Get, UseInterceptors, Query } from '@nestjs/common';

@Controller('blog')
@ApiTags('Blog')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class BlogController
{
    constructor(private readonly blogService: BlogService) {}

   @Post('/')
   @ApiConsumes( SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
   @HttpCode(HttpStatus.OK)
    async CreateBlogC(@Body() blogData: CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }>
    {
        return await this.blogService.CreateBlogS(blogData);
    }

   @Get('/')
   @HttpCode(HttpStatus.OK)
   @Pagination()
   @SkipAuthDecorator() // Skip Authentication
   @FilterBlog()
   async BlogList(@Query() paginationData: PaginationDto, @Query() filterBlogDto : FilterBlogDto )
   {
       return await this.blogService.BlogList(paginationData, filterBlogDto);
   }

   @Get('/myblogs')
   @HttpCode(HttpStatus.OK)
   async myBlogs()
   {
       return await this.blogService.MyBlogs();
       // throw new HttpException("this is test",HttpStatus.NOT_FOUND)
   }
}
