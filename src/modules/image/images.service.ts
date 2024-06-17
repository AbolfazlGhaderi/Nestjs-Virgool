import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ImageDTO } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'src/app/models/image.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Injectable({ scope: Scope.REQUEST })
export class ImagesService {
   constructor(
      @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
      @Inject(REQUEST) private readonly request: Request
   ) {}

   async create(imageData: ImageDTO) {
      return { message: 'ok' };
   }
}
