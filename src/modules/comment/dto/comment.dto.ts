import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto
{
    @ApiProperty({ nullable: false })
    @IsString()
    @Length(2)
    text: string;
    @ApiProperty({ nullable: false })
    @IsNotEmpty()
    @IsUUID()
    blogId: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    parentId?: string;
}