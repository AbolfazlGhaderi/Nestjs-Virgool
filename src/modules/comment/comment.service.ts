import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserEntity } from '../../app/models';
import { PaginationDto } from '../../common/dtos';
import { BlogService } from '../blog/blog.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/comment.dto';
import { NotFoundMessages } from '../../common/enums';
import { CommentEntity } from '../../app/models/comment.model';
import { PublicMessage } from '../../common/enums/message.enum';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope:Scope.REQUEST })
export class CommentService
{
    constructor(
        @InjectRepository(CommentEntity) private readonly commentRepository : Repository<CommentEntity>,
        private readonly blogService : BlogService,
        @Inject(REQUEST) private readonly request: Request,
    ) {}


    async CreateComment(commentData:CreateCommentDto)
    {
        const user = this.request.user as UserEntity;
        const { blogId, parentId, text } = commentData;
        let parentComment = null;

        // Check Blog
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { status, blog } = await this.blogService.CheckExistBlogById(blogId);

        if (!blog || status === false) throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);

        if (parentId)
        {
            parentComment = await this.commentRepository.findOne({ where: {  id:parentId  } });
            console.log(parentComment);
            if (!parentComment) throw new HttpException(NotFoundMessages.CommentNotFound, HttpStatus.NOT_FOUND);
        }

        const comment = await this.commentRepository.insert({
            text: text,
            blog:blog,
            user:user,
            parent: { id:parentId },

        });

        return { message:PublicMessage.CreateSuccess };
    }


    async CommentList(pagintionData:PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(pagintionData);
        const [ comments, count ] = await this.commentRepository.findAndCount({
            where:{},
            relations:{ blog: true, user: { profile:true } },
            select:{
                blog:{ id:true, title: true },
                user:{ username: true, profile: { nick_name: true } },
            },
            skip,
            take:limit,
            order:{ id:'DESC' },
        });


        return {
            pagination : paginationGenerator(count, page, limit),
            comments:comments,
        };
    }
}
