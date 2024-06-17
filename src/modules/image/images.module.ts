import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/app/models/image.model';

@Module({
  imports:[TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
