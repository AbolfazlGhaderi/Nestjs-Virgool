import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogService } from '../blog/blog.service';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentEntity } from '../../app/models/comment.model';
import { AuthModule } from '../auth/auth.module';
import { BlogModule } from '../blog/blog.module';

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ CommentEntity ]), BlogModule ],
    controllers: [ CommentController ],
    providers: [ CommentService, BlogService ],
})
export class CommentModule {}
