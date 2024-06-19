import { extname } from 'path';
import { ValidationMessage } from 'src/common/enums';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class FileChecker {
   static CheckImageFormat(file: Express.Multer.File) {
      const formats = ['.png', '.jpg', '.jpeg'];
      const ext = extname(file.originalname).toLowerCase();
      if (!formats.includes(ext)) throw new HttpException(ValidationMessage.invalidImageFormat, HttpStatus.BAD_REQUEST);
   }
}
