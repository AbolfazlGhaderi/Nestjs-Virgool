import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { PublicMessage } from '../..//common/enums';
@Injectable()
export class S3Service
{
   private readonly s3: S3Client;
   constructor()
   {
       this.s3 = new S3Client({
           region: 'default',
           endpoint: process.env.LIARA_OBJS_ENDPOINT,
           credentials: {
               accessKeyId: process.env.LIARA_ACCESS_OBJS_KEY,
               secretAccessKey: process.env.LIARA_SECRET_OBJS_KEY,
           },
       });
   }

   async UploadFile(file: Express.Multer.File)
   {
       const Param = {
           Body: file.buffer,
           Bucket: process.env.LIARA_BUCKET_OBJS_NAME,
           Key: file.originalname,
       };

       try
       {
           return await this.s3.send(new PutObjectCommand(Param));
       }
       catch (error)
       {
           console.log(error);
           throw new HttpException(PublicMessage.SystemError, HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }

   async ShowFiles()
   {
       const parameters = {
           Bucket: process.env.LIARA_BUCKET_OBJS_NAME,
       };

       const data = await this.s3.send(new ListObjectsV2Command(parameters));
       console.log(data);
       const files = data.Contents?.map((file) => file.Key);

       return files;
   }
}
