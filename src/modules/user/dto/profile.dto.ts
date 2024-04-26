import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";
import { GenderEnum } from "src/common/enums/profile";

export class ProfileDto {
  @ApiProperty()
  @Length(3, 100)
  @IsString()
  nick_name: string;
  @ApiPropertyOptional({ nullable: true , format: 'binary'})
  image_profile: string;
  @ApiPropertyOptional({ nullable: true , format: 'binary'})
  bg_image: string;
  @ApiPropertyOptional({ nullable: true })
  @Length(10, 200)
  bio: string;
  @ApiPropertyOptional({ nullable: true ,  enum:GenderEnum })
  @IsEnum(GenderEnum)
  gender: string;
  @ApiPropertyOptional({ nullable: true ,example : '2024-04-26T05:05:15.719Z' })
  birth_day: Date;
  @ApiPropertyOptional({ nullable: true })
  x_profile: string;
  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string;
}