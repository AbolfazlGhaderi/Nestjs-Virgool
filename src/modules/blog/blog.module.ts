import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AddUserToReqWOV } from '../../app/middlewares'
import { BlogBookmarkEntity, BlogEntity, BlogLikesEntity, CategoryEntity } from '../../app/models'
import { BlogCategoryEntity } from '../../app/models/blog.category.model'
import { CommentEntity } from '../../app/models/comment.model'
import { AuthModule } from '../auth/auth.module'
import { CategoryService } from '../category/category.service'
import { CommentService } from '../comment/comment.service'
import { BlogController } from './blog.controller'
import { BlogService } from './blog.service'

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
        consumer.apply(AddUserToReqWOV).forRoutes('/blog/slug/:slug')
    }
}
