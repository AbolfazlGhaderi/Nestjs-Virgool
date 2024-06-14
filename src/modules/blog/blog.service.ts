import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { PaginationDto } from 'src/common/dtos';
import { PublicMessage } from 'src/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create.blog.dto';
import { BlogEntity, UserEntity } from 'src/app/models';
import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { NotFoundMessages } from '../../common/enums/message.enum';
import { ceateRandomByte, createSlug } from 'src/app/utils/functions.utils';
import { PaginationConfig, paginationGenerator } from 'src/app/utils/pagination.util';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
   constructor(
      @InjectRepository(BlogEntity) private readonly BlogRepository: Repository<BlogEntity>,
      @Inject(REQUEST) private readonly request: Request
   ) {}

   async CreateBlogS(blogData: CreateBlogDto): Promise<{ message: PublicMessage.CreateSuccess }> {
      const user = this.request.user as UserEntity;
      // create Or set slug
      let { title, slug, content, description, time_for_study, image } = blogData;
      let slugData = slug ?? title;
      slugData = createSlug(slugData);
      const existBlog = await this.CheckExistBlogBySlug(slugData);
      if (existBlog) {
         slugData += `-${ceateRandomByte(8)}`;
      }
      const blog = this.BlogRepository.create({
         title: title.toString(),
         slug: slugData,
         content: content.toString(),
         description: description.toString(),
         time_for_study: time_for_study,
         status: BlogStatus.Draft,
         image,
         user: { id: user.id }
      });
      await this.BlogRepository.save(blog);
      return {
         message: PublicMessage.CreateSuccess
      };
   }

   async CheckExistBlogBySlug(slug: string): Promise<boolean> {
      const blog = await this.BlogRepository.findOne({ where: { slug: slug } });
      return !!blog;
   }

   async MyBlogs(): Promise<BlogEntity[]> {
      const user = this.request.user as UserEntity;

      const blogs = await this.BlogRepository.find({ where: { user: { id: user.id } }, order: { id: 'DESC' } });
      if (blogs.length <= 0) {
         throw new HttpException(NotFoundMessages.blogNotFound, HttpStatus.NOT_FOUND);
      }

      return blogs;
   }

   async BlogList(paginationData: PaginationDto) {
      const { limit, page, skip } = PaginationConfig(paginationData);
      const [blogs, count] = await this.BlogRepository.findAndCount({
         order: { id: 'DESC' },
         skip,
         take: limit
      });

      if (blogs.length <= 0) {
         throw new HttpException(NotFoundMessages.blogNotFound, HttpStatus.NOT_FOUND);
      }

      return {
         pagination: paginationGenerator(count, page, limit),
         blogs
      };
   }
}
