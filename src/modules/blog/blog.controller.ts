import { BlogService } from './blog.service';
import { PaginationDto } from '../../common/dtos';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PublicMessage, SwaggerConsumes } from '../../common/enums';
import { FilterBlog } from '../../common/decorators/filter.decorator';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { SkipAuthDecorator } from '../../common/decorators/skipAuth.decorator';
import { ResponseControllerInterceptor } from '../../app/interceptors/response.controller.interceptor';
import { Body, Controller, Post, HttpStatus, HttpCode, Get, UseInterceptors, Query, Param, Delete, Put } from '@nestjs/common';

@Controller('blog')
@ApiTags('Blog')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class BlogController
{
    constructor(private readonly blogService: BlogService) {}

    @Post('/')
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
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
    async BlogList(@Query() paginationData: PaginationDto, @Query() filterBlogDto: FilterBlogDto)
    {
        return await this.blogService.BlogList(paginationData, filterBlogDto);
    }


    @Get('/slug/:slug')
    @HttpCode(HttpStatus.OK)
    @SkipAuthDecorator() // Skip Authentication
    @Pagination()
    async FindOneBlogBySlug(@Param('slug') slug: string, @Query() paginationDto:PaginationDto)
    {
        return await this.blogService.FindOneBlogBySlug(slug, paginationDto);
    }

    @Get('/myblogs')
    @HttpCode(HttpStatus.OK)
    async MyBlogs()
    {
        return await this.blogService.MyBlogs();
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async DeleteBlog(@Param('id') id: string)
    {
        return await this.blogService.DeleteBlog(id);
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async UpdateBlog(@Param('id') id: string, @Body() updateBlogDto:UpdateBlogDto)
    {
        return await this.blogService.UpdateBlog(id, updateBlogDto);
    }

    @Get('/like/:id')
    @HttpCode(HttpStatus.OK)
    async LikeToggle(@Param('id') id: string)
    {
        return await this.blogService.LikeToggle(id);
    }

    @Get('/bookmark/:id')
    @HttpCode(HttpStatus.OK)
    async BookmarkToggle(@Param('id') id: string)
    {
        return await this.blogService.BookmarkToggle(id);
    }
}
