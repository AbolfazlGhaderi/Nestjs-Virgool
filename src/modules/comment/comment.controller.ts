import { PaginationDto } from '../../common/dtos';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';
import { SwaggerConsumes } from '../../common/enums';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { ResponseControllerInterceptor } from '../../app/interceptors/response.controller.interceptor';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseInterceptors } from '@nestjs/common';

@Controller('comment')
@ApiTags('Comment')
@AuthDecorator()
@UseInterceptors(ResponseControllerInterceptor)
export class CommentController
{
    constructor(private readonly commentService: CommentService) {}

    @Post('/')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes(SwaggerConsumes.Json, SwaggerConsumes.UrlEncoded)
    async InsertComment(@Body()comentDto: CreateCommentDto)
    {
        return await this.commentService.CreateComment(comentDto);
    }


    @Get('/')
    @HttpCode(HttpStatus.OK)
    @Pagination() // Swagger
    async CommentList(@Query() paginationData: PaginationDto)
    {
        return await this.commentService.CommentList(paginationData);
    }

    @Put('/accept/:id') // TODO: Just Admin
    @HttpCode(HttpStatus.OK)
    async AcceptComment(@Param('id', ParseUUIDPipe) id:string)
    {
        return await this.commentService.AcceptComment(id);
    }
}
