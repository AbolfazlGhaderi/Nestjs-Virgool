import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ImageDTO } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'src/app/utils/multer.util';
import { ImageEntity } from 'src/app/models/image.model';
import { HashingUtils } from 'src/app/utils/hashing.utils';
import { NotFoundMessages } from 'src/common/enums/message.enum';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ImagesService {
   constructor(
      @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
      @Inject(REQUEST) private readonly request: Request
   ) {}

   
   async SaveImageBlog(imageData: ImageDTO , file:MulterFile) {
      const hashFile = await HashingUtils.hashFile(file.path)
      if (hashFile === false) {
       throw new HttpException(NotFoundMessages.imageNotFound, HttpStatus.NOT_FOUND);
      }
      return file
   }
}
