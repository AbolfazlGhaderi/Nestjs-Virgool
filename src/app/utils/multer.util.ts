import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import { mkdirSync } from "fs"
import { diskStorage } from "multer"
import { extname, join } from "path"
import { ValidationMessage } from "src/common/enums"

type DestinationCallback =  (error: Error | null, destination: string) => void
type FileNameCallback =  (error: Error | null, filename: string) => void

export type MulterFile = Express.Multer.File


export function MulterDestination(FolderName : string){

    return function (request : Request , file : MulterFile , callback : DestinationCallback) : void{
        
        const path = join('Public','Uploads',FolderName)
        mkdirSync(path, { recursive: true })
        callback(null , path)
    }
}


export function MulterFileName(request : Request , file : MulterFile , cb : FileNameCallback) : void{
    const formats = ['.png', '.jpg', '.jpeg'];

    const ext = extname(file.originalname).toLowerCase();

    if (!checkImageFormat(ext, formats))
      cb(new BadRequestException(ValidationMessage.invalidImageFormat), null);
    else {
      const userId = request.user.id ?? 'UNKNOWN';
      const filename = `${userId}_${Date.now()}${ext}`;
      cb(null, filename);
    }
}


function checkImageFormat(ext : string , Formats : string[] ){

    return Formats.includes(ext)

}


export function MulterStorage(folderName: string) {
  return diskStorage({
    destination: MulterDestination(folderName),
    filename: MulterFileName,
  });
}

