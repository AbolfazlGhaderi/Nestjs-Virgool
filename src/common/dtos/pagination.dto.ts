import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class PaginationDto
{
    @ApiPropertyOptional({ type : 'integer' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    page: string;
    @ApiPropertyOptional({ type : 'integer' })
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    limit: string;
}