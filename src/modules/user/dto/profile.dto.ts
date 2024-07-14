import { GenderEnum } from '../../../common/enums/profile';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class ProfileDto
{
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  @IsString()
  nickName: string;
  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  @IsOptional()
  imageProfile: string;
  @ApiPropertyOptional({ nullable: true, format: 'binary' })
  @IsOptional()
  bgImage: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true,  enum:GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: string;
  @ApiPropertyOptional({ nullable: true, example : '2024-04-26T05:05:15.719Z' })
  @IsOptional()
  birthDay: Date;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  xProfile: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  linkedinProfile: string;
}