import { MulterStorage } from '../utils/multer.util';
import { FileInterceptor } from '@nestjs/platform-express';

export function UploadeImageInterceptor(fieldName: string, folderName: string = 'images')
{
    return class UploadeUtility extends FileInterceptor(fieldName, {
        storage: MulterStorage(folderName),
    }) {};
}
