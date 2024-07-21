import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from '../../app/models/blog.category.model';
import { BlogBookmarkEntity, BlogEntity, BlogLikesEntity, CategoryEntity } from '../../app/models';

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ BlogEntity, BlogCategoryEntity, CategoryEntity, BlogLikesEntity, BlogBookmarkEntity ]) ],
    controllers: [ BlogController ],
    providers: [ BlogService, CategoryService ],
})
export class BlogModule {}
