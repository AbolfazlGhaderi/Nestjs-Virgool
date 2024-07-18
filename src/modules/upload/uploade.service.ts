import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { S3Service } from './s3.service';
import { ImageDTO } from './dto/image.dto';
import { UserEntity } from '../../app/models';
import { InjectRepository } from '@nestjs/typeorm';
import { MulterFile } from '../../app/utils/multer.util';
import { ImageEntity } from '../../app/models/image.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import  { FileChecker }  from '../../app/utils/file.checker.utils';
import { GenerateImageName } from '../../app/utils/functions.utils';

@Injectable({ scope: Scope.REQUEST })
export class UploadeService
{
    private objsLocationServer = process.env.OBJS_LOCATION_ENDPOINT;
    constructor(
        @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly s3Service: S3Service,
    ) {}

    async uploadeImageBlog(imageData: ImageDTO, file: MulterFile)
    {
        const user = this.request.user as UserEntity;
        const { alt } = imageData;

        // Check Image Format
        FileChecker.CheckImageFormat(file);

        // Generate Name to image
        file.originalname = GenerateImageName(file.originalname, 'Blog');

        // Uploade image to OBJS
        await this.s3Service.UploadFile(file);
        const location = `${this.objsLocationServer}/${file.originalname}`;

        // Save Image

        await this.imageRepository.insert({
            alt : alt ?? 'image',
            location,
            name: file.originalname,
            user: { id: user.id },
        });
        return { location };
    }

    async uploadImageProfile( file: MulterFile)
    {
        // Check Image Format
        FileChecker.CheckImageFormat(file);

        // Generate Name to image
        file.originalname = GenerateImageName(file.originalname, 'Profile');

        const result = await this.s3Service.UploadFile(file);
        const location = `${this.objsLocationServer}/${file.originalname}`;

        return {
            location,
        };
    }
    // async ShowFiles(){
    //    return await this.S3.ShowFiles()
    // }
}
