import { Module } from '@nestjs/common';
import { CategoryEntity } from '../../app/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
    imports : [ TypeOrmModule.forFeature([ CategoryEntity ]) ],
    controllers: [ CategoryController ],
    providers: [ CategoryService ],
})
export class CategoryModule {}
