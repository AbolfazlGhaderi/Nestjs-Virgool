import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateCatetegoryDto
{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsOptional()
    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsString()
    parentId?: string;
}
