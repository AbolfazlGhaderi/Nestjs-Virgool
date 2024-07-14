import { extname } from 'node:path';
import { ValidationMessage } from '../../common/enums';
import { HttpException, HttpStatus } from '@nestjs/common';

class FileChecker
{
    private static instance: FileChecker;

    static get(): FileChecker
    {
        if (!FileChecker.instance)
        {
            FileChecker.instance = new FileChecker();
        }
        return FileChecker.instance;
    }

    CheckImageFormat(file: Express.Multer.File)
    {
        const formats = [ '.png', '.jpg', '.jpeg' ];
        const extension = extname(file.originalname).toLowerCase();
        if (!formats.includes(extension)) throw new HttpException(ValidationMessage.InvalidImageFormat, HttpStatus.BAD_REQUEST);
    }
}


const instance = FileChecker.get();

export { instance as FileChecker };