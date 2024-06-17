import { ApiPropertyOptional } from '@nestjs/swagger';

export class ImageDTO {
   @ApiPropertyOptional({ format: 'binary' })
   image: string;
}
