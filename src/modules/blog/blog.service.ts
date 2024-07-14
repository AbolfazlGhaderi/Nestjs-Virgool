import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { PaginationDto } from '../../common/dtos';
import { PublicMessage } from '../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create.blog.dto';
import { BlogEntity, UserEntity } from '../../app/models';
import { BlogStatus } from '../../common/enums/blog/status.enum';
import { NotFoundMessages } from '../../common/enums/message.enum';
import { GenerateRandomByte, createSlug } from '../../app/utils/functions.utils';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogService
{
    constructor(
      @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
      @Inject(REQUEST) private readonly request: Request,
    ) {}

    async CreateBlogS(blogData: CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }>
    {
        const user = this.request.user as UserEntity;
        // create Or set slug
        const { title, slug, content, description, time_for_study : time, image } = blogData;
        let slugData = slug ?? title;
        slugData = createSlug(slugData);
        const hasBlog = await this.CheckExistBlogBySlug(slugData);
        if (hasBlog)
        {
            slugData += `-${GenerateRandomByte(8)}`;
        }
        const blog = this.blogRepository.create({
            title: title.toString(),
            slug: slugData,
            content: content.toString(),
            description: description.toString(),
            time_for_study: time,
            status: BlogStatus.Draft,
            image,
            user: { id: user.id },
        });
        await this.blogRepository.save(blog);
        return {
            message: PublicMessage.CreateSuccess,
        };
    }

    async CheckExistBlogBySlug(slug: string): Promise<boolean>
    {
        const blog = await this.blogRepository.findOne({ where: { slug: slug } });
        return !!blog;
    }

    async MyBlogs(): Promise<BlogEntity[]>
    {
        const user = this.request.user as UserEntity;

        const blogs = await this.blogRepository.find({ where: { user: { id: user.id } }, order: { id: 'DESC' } });
        if (blogs.length <= 0)
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }

        return blogs;
    }

    async BlogList(paginationData: PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        const [ blogs, count ] = await this.blogRepository.findAndCount({
            order: { id: 'DESC' },
            skip,
            take: limit,
        });

        if (blogs.length <= 0)
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }

        return {
            pagination: paginationGenerator(count, page, limit),
            blogs,
        };
    }
}
