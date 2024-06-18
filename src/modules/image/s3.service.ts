import { Injectable} from '@nestjs/common';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
@Injectable()
export class S3Service {
   private readonly s3: S3Client;
   constructor() {
      this.s3 = new S3Client({
         region: 'default',
         endpoint: process.env.LIARA_OBJS_ENDPOINT,
         credentials: {
            accessKeyId: process.env.LIARA_ACCESS_OBJS_KEY,
            secretAccessKey: process.env.LIARA_SECRET_OBJS_KEY
         }
      });
   }

   async uploadFile(file: Express.Multer.File) {

      const Param = {
         Body: file.buffer,
         Bucket: process.env.LIARA_BUCKET_OBJS_NAME,
         Key: file.originalname
      };

      try{
      return await this.s3.send(new PutObjectCommand(Param));
      }catch(err){
        console.log(err);
      }
   }
}
