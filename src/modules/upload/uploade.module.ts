import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadeService } from './uploade.service';
import { AuthModule } from '../auth/auth.module';
import { UploadeController } from './uploade.controller';
import { ImageEntity } from '../../app/models/image.model';

@Module({
    imports: [ TypeOrmModule.forFeature([ ImageEntity ]), AuthModule ],
    controllers: [ UploadeController ],
    providers: [ UploadeService, S3Service ],
})
export class UploadeModule {}
