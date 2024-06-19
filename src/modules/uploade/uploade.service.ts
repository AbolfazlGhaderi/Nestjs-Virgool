import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { S3Service } from './s3.service';
import { ImageDTO } from './dto/image.dto';
import { UserEntity } from 'src/app/models';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from 'src/app/utils/multer.util';
import { ImageEntity } from 'src/app/models/image.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { FileChecker } from 'src/app/utils/file.checker.utils';
import { GenerateImageName } from 'src/app/utils/functions.utils';

@Injectable({ scope: Scope.REQUEST })
export class UploadeService {
   private OBJSLocationServer = process.env.OBJS_LOCATION_ENDPOINT;
   constructor(
      @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
      @Inject(REQUEST) private readonly request: Request,
      private readonly S3: S3Service
   ) {}

   async UploadeImage(imageData: ImageDTO, file: MulterFile) {
      const user = this.request.user as UserEntity;
      const { alt } = imageData;

      // Check Image Format
      FileChecker.CheckImageFormat(file);

      // Generate Name to image
      file.originalname = GenerateImageName(file.originalname);

      // Uploade image to OBJS
      const res = await this.S3.UploadFile(file);
      const location = `${this.OBJSLocationServer}/${file.originalname}`;

      // Save Image

      await this.imageRepository.insert({
         alt,
         location,
         name: file.originalname,
         user: { id: user.id }
      });
      return { location };
   }

   // async ShowFiles(){
   //    return await this.S3.ShowFiles()
   // }
}
