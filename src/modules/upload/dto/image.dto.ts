import { ApiProperty } from '@nestjs/swagger';

export class ImageDTO
{
   @ApiProperty({ required:true })
   alt:string;
   @ApiProperty({ format: 'binary', required:true })
   image: string;
}
