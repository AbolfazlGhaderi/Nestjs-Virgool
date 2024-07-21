import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { BlogEntity, BlogLikesEntity, CategoryEntity } from '../../app/models';
import { BlogCategoryEntity } from '../../app/models/blog.category.model';
import { CategoryService } from '../category/category.service';

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ BlogEntity, BlogCategoryEntity, CategoryEntity, BlogLikesEntity ]) ],
    controllers: [ BlogController ],
    providers: [ BlogService, CategoryService ],
})
export class BlogModule {}
