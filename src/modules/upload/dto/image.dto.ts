import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class ImageDTO
{
   @ApiProperty({ nullable:true, required:false })
   @IsOptional()
   alt:string
   @ApiProperty({ format: 'binary', required:true })
   image: string
}
