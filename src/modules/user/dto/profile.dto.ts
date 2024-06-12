import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { GenderEnum } from "src/common/enums/profile";

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  @IsString()
  nick_name: string;
  @ApiPropertyOptional({ nullable: true , format: 'binary'})
  @IsOptional()
  image_profile: string;
  @ApiPropertyOptional({ nullable: true , format: 'binary'})
  @IsOptional()
  bg_image: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true ,  enum:GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: string;
  @ApiPropertyOptional({ nullable: true ,example : '2024-04-26T05:05:15.719Z' })
  @IsOptional()
  birth_day: Date;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  x_profile: string;
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  linkedin_profile: string;
}