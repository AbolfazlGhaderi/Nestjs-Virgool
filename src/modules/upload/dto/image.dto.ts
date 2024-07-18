import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImageDTO
{
   @ApiProperty({ nullable:true })
   @IsOptional()
   alt:string;
   @ApiProperty({ format: 'binary', required:true })
   image: string;
}
