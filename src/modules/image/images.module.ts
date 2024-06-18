import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesService } from './images.service';
import { AuthModule } from '../auth/auth.module';
import { ImagesController } from './images.controller';
import { ImageEntity } from 'src/app/models/image.model';

@Module({
   imports: [TypeOrmModule.forFeature([ImageEntity]), AuthModule],
   controllers: [ImagesController],
   providers: [ImagesService,S3Service]
})
export class ImagesModule {}
