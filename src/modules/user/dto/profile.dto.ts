import { GenderEnum } from '../../../common/enums/profile';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class ProfileDto
{
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  @IsString()
  nickName: string;
  // @ApiPropertyOptional({ nullable: true, format: 'binary' })
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  imageProfile: string;
  // @ApiPropertyOptional({ nullable: true, format: 'binary' })
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()

  bgImage: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true,  enum:GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: string;
  @ApiPropertyOptional({ nullable: true, example : '2003-01-01' })
  @IsOptional()
  @IsDateString()
  birthDay: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  xProfile: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  linkedinProfile: string;
}