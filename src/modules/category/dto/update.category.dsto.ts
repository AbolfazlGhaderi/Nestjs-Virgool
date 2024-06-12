import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  parentId: string;
}
