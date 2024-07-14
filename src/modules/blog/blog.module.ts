import { Module } from '@nestjs/common';
import { BlogEntity } from '../../app/models';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';

@Module({
    imports:[ AuthModule, TypeOrmModule.forFeature([ BlogEntity ]) ],
    controllers: [ BlogController ],
    providers: [ BlogService ],
})
export class BlogModule {}
