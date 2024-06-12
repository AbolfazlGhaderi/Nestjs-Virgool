import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/app/models';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports:[AuthModule,TypeOrmModule.forFeature([BlogEntity])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
