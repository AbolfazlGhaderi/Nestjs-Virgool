import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { mkdirSync } from 'node:fs';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { ValidationMessage } from '../../common/enums';
import { UserEntity } from '../models';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export type MulterFile = Express.Multer.File;

export function MulterDestination(folderName: string)
{
    return function (request: Request, file: MulterFile, callback: DestinationCallback): void
    {
        const path = join('Public', 'Uploads', folderName);
        mkdirSync(path, { recursive: true });
        callback(null, path);
    };
}

export function MulterFileName(request: Request, file: MulterFile, callback: FileNameCallback): void
{
    const formats = [ '.png', '.jpg', '.jpeg' ];
    const user = request.user as UserEntity;
    const extension = extname(file.originalname).toLowerCase();

    if (checkImageFormat(extension, formats))
    {
        const userId = user?.id ?? 'UNKNOWN';
        const filename = `${userId}_${Date.now()}${extension}`;
        callback(null, filename);
    }
    else { callback(new HttpException(ValidationMessage.InvalidImageFormat, HttpStatus.BAD_REQUEST), ''); }
}

function checkImageFormat(extension: string, formats: string[])
{
    return formats.includes(extension);
}

export function MulterStorage(folderName: string)
{
    return diskStorage({
        destination: MulterDestination(folderName),
        filename: MulterFileName,
    });
}
