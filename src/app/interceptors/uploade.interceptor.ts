import { FileInterceptor } from '@nestjs/platform-express'

import { MulterStorage } from '../utils/multer.util'

export function UploadeImageInterceptor(fieldName: string, folderName: string = 'images')
{
    return class UploadeUtility extends FileInterceptor(fieldName, {
        storage: MulterStorage(folderName),
    }) {}
}
