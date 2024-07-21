import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isArray, isUUID } from 'class-validator';
import { PaginationDto } from '../../common/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { BlogStatus } from '../../common/enums/blog/status.enum';
import { BlogCategoryEntity } from '../../app/models/blog.category.model';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { GenerateRandomByte, createSlug } from '../../app/utils/functions.utils';
import { ModelEnum, PublicMessage,  NotFoundMessages } from '../../common/enums';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';
import { BlogBookmarkEntity, BlogEntity, BlogLikesEntity, UserEntity } from '../../app/models';

@Injectable({ scope: Scope.REQUEST })
export class BlogService
{
    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private readonly blogCategoryRepository: Repository<BlogCategoryEntity>,
        @InjectRepository(BlogLikesEntity) private readonly blogLikeRepository: Repository<BlogLikesEntity>,
        @InjectRepository(BlogBookmarkEntity) private readonly blogBookmarkRepository: Repository<BlogBookmarkEntity>,
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
            .leftJoin('blogs.user', 'author')
            .leftJoin('author.profile', 'profile')
            .addSelect([ 'categories.id', 'category.title', 'author.username', 'author.id', 'profile.nick_name', 'profile.image_profile' ])
            .where(where, { category, search })
            .loadRelationCountAndMap('blogs.likes', 'blogs.likes')
            .loadRelationCountAndMap('blogs.bookmarks', 'blogs.bookmarks')
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
    async CheckExistMyBlogById(id: string)
    {
        const user = this.request.user as UserEntity;
        const blog = await this.blogRepository.findOne({ where: { id: id, user: { id:user.id } } });
        return { status: !!blog, blog:blog };
    }
    async CheckExistBlogById(id: string)
    {
        const blog = await this.blogRepository.findOne({ where: { id: id } });
        return { status: !!blog, blog:blog };
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
        // eslint-disable-next-line unicorn/no-await-expression-member
        if (!(await this.CheckExistMyBlogById(id)).status)
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);

        }
        await this.blogRepository.delete({ id:id });
        return {
            message : PublicMessage.DeleteSuccess,
        };
    }


    async UpdateBlog(id:string, blogData:UpdateBlogDto)
    {
        // variables
        const user = this.request.user as UserEntity;
        if (!isUUID(id))
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }
        // Check Blug
        // TODO: Check it
        const { blog } = await this.CheckExistMyBlogById(id);
        if (!blog)
        {
            throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);
        }
        const { title, slug, content, description, time_for_study: time, image } = blogData;
        let { categories } = blogData;

        // Check Category
        if (!isArray(categories) && typeof categories === 'string')  // TODO: Fix this / Should be Array
        {

            categories = categories.split(',');
        }
        else if (!categories || categories.length <= 0)
        {
            throw new HttpException(NotFoundMessages.CategoryNotFound, HttpStatus.NOT_FOUND);
        }

        if (isArray(categories) && categories.length > 0)
        {
            // Delete Blog Category
            await this.blogCategoryRepository.delete({ blog: { id: blog.id } });
        }

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

        let slugData = slug || title;
        if (slugData) slugData = createSlug(slugData);

        blog.title = title || blog.title;
        blog.slug = slugData || blog.slug;
        blog.description = description || blog.description;
        blog.content = content || blog.content;
        blog.time_for_study = time || blog.time_for_study;
        blog.image = image || blog.image;

        await this.blogRepository.save(blog);

        return {
            message:PublicMessage.UpdateSuccess,
        };

    }

    async LikeToggle(id:string)
    {
        let message = PublicMessage.Like;
        const user = this.request.user as UserEntity;

        // Check Blog 
        const { blog } = await this.CheckExistMyBlogById(id);
        if (!blog) throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);

        // Check Like
        const isLiked = await this.blogLikeRepository.findOne({ where: { blog: { id: blog.id }, user: { id: user.id } } });
        if (isLiked)
        {
            await this.blogLikeRepository.delete({ blog: { id: blog.id }, user: { id: user.id } });
            message = PublicMessage.DisLike;
        }
        else  await this.blogLikeRepository.insert({ blog: { id: blog.id }, user: { id: user.id } });

        return {
            message,
        };
    }
    async BookmarkToggle(id:string)
    {
        let message = PublicMessage.Bookmark;
        const user = this.request.user as UserEntity;

        // Check Blog 
        const { blog } = await this.CheckExistMyBlogById(id);
        if (!blog) throw new HttpException(NotFoundMessages.BlogNotFound, HttpStatus.NOT_FOUND);

        // Check Like
        const isBookmarked = await this.blogBookmarkRepository.findOne({ where: { blog: { id: blog.id }, user: { id: user.id } } });
        if (isBookmarked)
        {
            await this.blogBookmarkRepository.delete({ blog: { id: blog.id }, user: { id: user.id } });
            message = PublicMessage.UnBookmark;
        }
        else  await this.blogBookmarkRepository.insert({ blog: { id: blog.id }, user: { id: user.id } });

        return {
            message,
        };
    }


}
