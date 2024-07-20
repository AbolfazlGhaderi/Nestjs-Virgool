import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isArray, isUUID } from 'class-validator';
import { PaginationDto } from '../../common/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BlogEntity, UserEntity } from '../../app/models';
import { ModelEnum, PublicMessage } from '../../common/enums';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { CategoryService } from '../category/category.service';
import { BlogStatus } from '../../common/enums/blog/status.enum';
import { NotFoundMessages } from '../../common/enums/message.enum';
import { BlogCategoryEntity } from '../../app/models/blog.category.model';
import { GenerateRandomByte, createSlug } from '../../app/utils/functions.utils';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogService
{
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
        private readonly categoryService: CategoryService,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    async CreateBlogS(blogData: CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }>
    {
        // variables
        const user = this.request.user as UserEntity;
        const { title, slug, content, description, time_for_study: time, image } = blogData;
        let { categories } = blogData;

        // Ckeck Slug
        let slugData = slug ?? title;
        slugData = createSlug(slugData);
        const hasBlog = await this.CheckExistBlogBySlug(slugData);
        if (hasBlog)
        {
            slugData += `-${GenerateRandomByte(8)}`;
        }

        // Check Category
        if (!isArray(categories) && typeof categories === 'string')  // TODO: Fix this / Should be Array
        {

            categories = categories.split(',');
        }
        else if (!categories || categories.length <= 0)
        {
            throw new HttpException(NotFoundMessages.CategoryNotFound, HttpStatus.NOT_FOUND);
        }

        // TODO: Use Transaction

        // Save Blog
        let blog = this.blogRepository.create({
            title: title.toString(),
            slug: slugData,
            content: content.toString(),
            description: description,
            time_for_study: time,
            status: BlogStatus.Draft,
            image,
            user: { id: user.id },
        });
        blog = await this.blogRepository.save(blog);

        // implement Blog Category
        for (const category of categories)
        {
            let _category = await this.categoryService.FindCategoryByTitle(category);
            if (!_category)
            {
                _category = await this.categoryService.InsertCategory(category);
            }

            await this.blogCategoryRepository.insert({ blog: { id: blog.id }, category: { id: _category.id } });
        }


        return {
            message: PublicMessage.CreateSuccess,
        };
    }


    async BlogList(paginationData: PaginationDto, filterBlogDto: FilterBlogDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        let { category, search } = filterBlogDto;


        let where = '';
        if (category)
        {
            category = category.toString().toLocaleLowerCase();
            if (where.length > 0) where += ' AND ';
            where += 'category.title = :category';
        }

        if (search)
        {
            if (where.length > 0) where += ' AND ';
            search = search.toString().toLocaleLowerCase();
            search = `%${search}%`;
            where += 'CONCAT(blogs.title, blogs.description, blogs.content) ILIKE :search';

        }

        const [ blogs, count ] = await this.blogRepository
            .createQueryBuilder(ModelEnum.Blog)
            .leftJoin('blogs.blog_categories', 'categories')
            .leftJoin('categories.category', 'category')
            .addSelect([ 'categories.id', 'category.title' ])
            .where(where, { category, search })
            .orderBy('blogs.create_at', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        if (blogs.length <= 0)
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }

        return {
            pagination: paginationGenerator(count, page, limit),
            blogs,
        };


        // const where: FindOptionsWhere<BlogEntity> = {};
        // if (category)
        // {
        //     where['blog_categories'] = {
        //         category: { title: category },
        //     };
        // }
        // const [ blogs, count ] = await this.blogRepository.findAndCount({
        //     relations: { blog_categories: { category: true } },
        //     where,
        //     select: { blog_categories: { id: true, category: { title: true } } },
        //     order: { id: 'DESC' },
        //     skip,
        //     take: limit,
        // });

    }
    async CheckExistBlogBySlug(slug: string): Promise<boolean>
    {
        const blog = await this.blogRepository.findOne({ where: { slug: slug } });
        return !!blog;
    }
    async CheckExistMyBlogById(id: string): Promise<boolean>
    {
        const user = this.request.user as UserEntity;
        const blog = await this.blogRepository.findOne({ where: { id: id, user: { id:user.id } } });
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

    async DeleteBlog(id :string)
    {
        if (!isUUID(id))
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }
        if (!await this.CheckExistMyBlogById(id))
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);

        }
        await this.blogRepository.delete({ id:id });
        return {
            message : PublicMessage.DeleteSuccess,
        };
    }
}
