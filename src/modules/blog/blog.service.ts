import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity, UserEntity } from 'src/app/models';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create.blog.dto';
import { ceateRandomByte, createSlug } from 'src/app/utils/functions.utils';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { ConflictMessages, PublicMessage } from 'src/common/enums';

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

   async checkExistBlogBySlug(slug: string) {
      const blog = await this.BlogRepository.findOne({ where: { slug: slug } });
      return !!blog;
   }

   async getAllBlogs() {
      return await this.BlogRepository.find();
   }
}
