import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateBlogDto
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(10, 100)
    title: string;
    @ApiProperty({ isArray: true, type: String })
    @IsNotEmpty()
    categories: string | string[];
    @ApiPropertyOptional()
    @IsOptional()
    // @IsString()
    slug: string;
    @ApiProperty()
    @IsNotEmpty()
    // @IsString()
    @IsNumberString()
    time_for_study: string;
    @ApiProperty()
    @IsNotEmpty()
    // @IsString()
    @Length(10, 300)
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    // @IsString()
    @Length(100)
    content: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    image: string;
}


export class FilterBlogDto
{

    @ApiPropertyOptional()
    @IsOptional()
    category: string;
}