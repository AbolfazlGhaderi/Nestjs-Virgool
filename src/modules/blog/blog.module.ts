import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { AddUserToReqWOV } from '../../app/middlewares';
import { CommentService } from '../comment/comment.service';
import { CommentEntity } from '../../app/models/comment.model';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from '../../app/models/blog.category.model';
import { BlogBookmarkEntity, BlogEntity, BlogLikesEntity, CategoryEntity } from '../../app/models';

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ BlogEntity, BlogCategoryEntity, CategoryEntity, BlogLikesEntity, BlogBookmarkEntity, CommentEntity ]) ],
    controllers: [ BlogController ],
    providers: [ BlogService, CategoryService, CommentService ],
    exports:[ TypeOrmModule.forFeature([ BlogEntity, BlogCategoryEntity, CategoryEntity, BlogLikesEntity, BlogBookmarkEntity ]), CategoryService ],
})
export class BlogModule implements NestModule
{
    configure(consumer: MiddlewareConsumer)
    {
        consumer.apply(AddUserToReqWOV).forRoutes('/blog/slug/:slug');
    }
}
