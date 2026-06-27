import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommentEntity } from '../../app/models/comment.model'
import { AuthModule } from '../auth/auth.module'
import { BlogModule } from '../blog/blog.module'
import { BlogService } from '../blog/blog.service'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ CommentEntity ]), BlogModule ],
    controllers: [ CommentController ],
    providers: [ CommentService, BlogService ],
})
export class CommentModule {}
