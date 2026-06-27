import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ImageEntity } from '../../app/models/image.model'
import { AuthModule } from '../auth/auth.module'
import { S3Service } from './s3.service'
import { UploadeController } from './uploade.controller'
import { UploadeService } from './uploade.service'

@Module({
    imports: [ TypeOrmModule.forFeature([ ImageEntity ]), AuthModule ],
    controllers: [ UploadeController ],
    providers: [ UploadeService, S3Service ],
})
export class UploadeModule {}
