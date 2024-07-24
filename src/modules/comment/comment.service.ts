import { Request } from 'express';
import { IsNull, Repository } from 'typeorm';
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
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope:Scope.REQUEST })
export class CommentService
{
    constructor(
        @InjectRepository(CommentEntity) private readonly commentRepository : Repository<CommentEntity>,
        @Inject(forwardRef(() => BlogService)) private readonly blogService : BlogService,
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


    // Admin
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

    async AcceptComment(id:string)
    {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const comment = await this.CheckExistCommentById(id);
        if (!comment) throw new HttpException(NotFoundMessages.CommentNotFound, HttpStatus.NOT_FOUND);
        if (comment.accepted === true) return { message: PublicMessage.Accept };
        comment.accepted = true;
        await this.commentRepository.save(comment);
        return { message:PublicMessage.Accept };
    }

    async RejectComment(id:string)
    {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const comment = await this.CheckExistCommentById(id);
        if (!comment) throw new HttpException(NotFoundMessages.CommentNotFound, HttpStatus.NOT_FOUND);
        if (comment.accepted === false) return { message: PublicMessage.Reject };
        comment.accepted = false;
        await this.commentRepository.save(comment);
        return { message:PublicMessage.Reject };
    }


    async FindCommentsOfBlug(blogId:string, paginationData:PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        const [ comments, count ] = await this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comments.blog', 'blog')
            .leftJoinAndSelect('comments.user', 'user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('comments.children', 'child1', 'child1.accepted = :accepted', { accepted: true })
            .leftJoinAndSelect('child1.user', 'child1User')
            .leftJoinAndSelect('child1User.profile', 'child1UserProfile')
            .leftJoinAndSelect('child1.children', 'child2', 'child2.accepted = :accepted', { accepted: true })
            .leftJoinAndSelect('child2.user', 'child2User')
            .leftJoinAndSelect('child2User.profile', 'child2UserProfile')
            .where('comments.blog_id = :blogId AND comments.accepted = :accepted ', { blogId, accepted: true })
            .andWhere('comments.parent IS NULL')
            .select([
                'comments',
                'blog.id',
                'blog.title',
                'user.username',
                'profile.nick_name',
                'profile.image_profile',
                'child1.text',
                'child1.create_at',
                'child1.id',
                'child1.accepted',
                'child1User.username',
                'child1UserProfile.nick_name',
                'child1UserProfile.image_profile',
                'child2.text',
                'child2.create_at',
                'child2.id',
                'child2.accepted',
                'child2User.username',
                'child2UserProfile.nick_name',
                'child2UserProfile.image_profile',
            ])
            .orderBy('comments.id', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();


        return {
            pagination: paginationGenerator(count, page, limit),
            comments: comments,
        };
    }
    // Common

    async CheckExistCommentById(id:string)
    {
        const comment = await this.commentRepository.findOne({ where:{ id:id } });
        // return { status: !!comment, comment:comment };
        return comment;
    }
}
