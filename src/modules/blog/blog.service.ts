import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { BlogEntity, UserEntity } from 'src/app/models';
import { ceateRandomByte, createSlug } from 'src/app/utils/functions.utils';
import { PublicMessage } from 'src/common/enums';
import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create.blog.dto';
import { NotFoundMessages } from '../../common/enums/message.enum';

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
      const existBlog = await this.checkExistBlogBySlug(slugData);
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

   async checkExistBlogBySlug(slug: string): Promise<boolean> {
      const blog = await this.BlogRepository.findOne({ where: { slug: slug } });
      return !!blog;
   }

   async myBlog(): Promise<BlogEntity[]> {
      const user = this.request.user as UserEntity;

      const blogs = await this.BlogRepository.find({ where: { user: { id: user.id } }, order: { id: 'DESC' } });
      if (blogs.length <= 0) {
         throw new HttpException(NotFoundMessages.blogNotFound, HttpStatus.NOT_FOUND);
      }

      return blogs;
   }
}
