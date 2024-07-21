import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../app/models/comment.model';
import { BlogService } from '../blog/blog.service';

@Injectable()
export class CommentService
{
    constructor(
        @InjectRepository(CommentEntity) private readonly commentRepository : Repository<CommentEntity>,
        private readonly blogService : BlogService,
    ) {}
}
