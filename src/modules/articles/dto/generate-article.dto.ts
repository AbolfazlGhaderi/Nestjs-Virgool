import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class GenerateArticleDto
{
    @ApiProperty({
        description: 'The topic of the article to generate',
        example: 'The Future of Artificial Intelligence in Healthcare',
    })
    @IsNotEmpty()
    @IsString()
    @Length(5, 200)
    topic: string

    @ApiProperty({
        description: 'Additional instructions for the AI',
        example: 'Focus on machine learning applications in diagnostics',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(0, 500)
    extraPrompt?: string
}
