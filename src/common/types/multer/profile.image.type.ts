import { MulterFile } from '../../../app/utils/multer.util';


export type ProfileImage = {
    bg_image: MulterFile[],
    image_profile: MulterFile[]
}