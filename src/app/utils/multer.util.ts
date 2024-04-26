import { Request } from "express"
import { mkdirSync } from "fs"
import { extname, join } from "path"

type DestinationCallback =  (error: Error | null, destination: string) => void
type FileNameCallback =  (error: Error | null, filename: string) => void

type MulterFile = Express.Multer.File


export function MulterDestination(FolderName : string){

    return function (request : Request , file : MulterFile , callback : DestinationCallback) : void{
        
        const path = join('Public','Uploads',FolderName)
        mkdirSync(path, { recursive: true })
        callback(null , path)
    }
}


export function MulterFileName(request : Request , file : MulterFile , cb : FileNameCallback) : void{

    const ext = extname(file.originalname)
    const userId = request.user.id ?? 'UNKNOWN'
    const filename = `${userId}_${Date.now()}.${ext}`
    cb(null , filename)

}


