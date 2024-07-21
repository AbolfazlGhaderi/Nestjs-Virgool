import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { ResponseControllerInterceptor } from '../../app/interceptors/response.controller.interceptor';
import { CreateCommentDto } from './dto/comment.dto';
import { SwaggerConsumes } from '../../common/enums';

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
}
