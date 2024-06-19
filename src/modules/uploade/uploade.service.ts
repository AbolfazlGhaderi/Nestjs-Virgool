import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { S3Service } from './s3.service';
import { ImageDTO } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'src/app/utils/multer.util';
import { ImageEntity } from 'src/app/models/image.model';
import { NotFoundMessages } from 'src/common/enums/message.enum';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UploadeService {
   constructor(
      @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
      @Inject(REQUEST) private readonly request: Request,
      private readonly S3: S3Service
   ) {}

   async SaveImage(imageData: ImageDTO, file: MulterFile) {
      const res = await this.S3.UploadFile(file);
      
      return res;
   }

   // async ShowFiles(){
   //    return await this.S3.ShowFiles()
   // }


}
