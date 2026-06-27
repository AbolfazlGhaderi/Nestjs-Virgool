import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryEntity } from '../../app/models'
import { AuthModule } from '../auth/auth.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
    imports : [ AuthModule, TypeOrmModule.forFeature([ CategoryEntity ]) ],
    controllers: [ CategoryController ],
    providers: [ CategoryService ],
})
export class CategoryModule {}
