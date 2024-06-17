import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ImageDTO } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'src/app/utils/multer.util';
import { ImageEntity } from 'src/app/models/image.model';
import { Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ImagesService {
   constructor(
      @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
      @Inject(REQUEST) private readonly request: Request
   ) {}

   async Save(imageData: ImageDTO , file:MulterFile) {
      return file
   }
}
