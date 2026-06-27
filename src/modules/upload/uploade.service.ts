import { Inject, Injectable, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'

import { UserEntity } from '../../app/models'
import { ImageEntity } from '../../app/models/image.model'
import  { FileChecker }  from '../../app/utils/file.checker.utils'
import { GenerateImageName } from '../../app/utils/functions.utils'
import { MulterFile } from '../../app/utils/multer.util'
import { ImageDTO } from './dto/image.dto'
import { S3Service } from './s3.service'

@Injectable({ scope: Scope.REQUEST })
export class UploadeService
{
    private objsLocationServer = process.env.OBJS_LOCATION_ENDPOINT
    constructor(
        @InjectRepository(ImageEntity) private readonly imageRepository: Repository<ImageEntity>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly s3Service: S3Service,
    ) {}

    async uploadeImageBlog(imageData: ImageDTO, file: MulterFile)
    {
        const user = this.request.user as UserEntity
        const { alt } = imageData

        // Check Image Format
        FileChecker.CheckImageFormat(file)

        // Generate Name to image
        file.originalname = GenerateImageName(file.originalname, 'Blog')

        // Uploade image to OBJS
        await this.s3Service.UploadFile(file)
        const location = `${this.objsLocationServer}/${file.originalname}`

        // Save Image

        await this.imageRepository.insert({
            alt : alt ?? 'image',
            location,
            name: file.originalname,
            user: { id: user.id },
        })
        return { location }
    }

    async uploadImageProfile( file: MulterFile)
    {
        // Check Image Format
        FileChecker.CheckImageFormat(file)

        // Generate Name to image
        file.originalname = GenerateImageName(file.originalname, 'Profile')

        const result = await this.s3Service.UploadFile(file)
        const location = `${this.objsLocationServer}/${file.originalname}`

        return {
            location,
        }
    }
    // async ShowFiles(){
    //    return await this.S3.ShowFiles()
    // }
}
