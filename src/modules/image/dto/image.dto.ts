import { ApiProperty } from '@nestjs/swagger';

export class ImageDTO {
   @ApiProperty({ format: 'binary' })
   image: string;
}
