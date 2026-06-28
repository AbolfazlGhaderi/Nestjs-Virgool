import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { GenerateArticleDto } from './dto/generate-article.dto'
import { ArticlesService } from './services/articles.service'

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController
{
    constructor(private readonly articlesService: ArticlesService) {}

    @Post('generate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Generate an AI-powered article (streaming)',
        description: 'Generates a professional Persian article in HTML format based on the provided topic and additional instructions. The response is streamed chunk by chunk.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Article generated successfully (streaming)',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid AI provider API key',
    })
    @ApiResponse({
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'AI provider rate limit exceeded',
    })
    @ApiResponse({
        status: HttpStatus.REQUEST_TIMEOUT,
        description: 'AI provider request timed out',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Failed to generate article',
    })
    async generateArticle(@Body() generateArticleDto: GenerateArticleDto, @Res() response: Response)
    {
        // Set SSE headers
        response.setHeader('Content-Type', 'text/event-stream')
        response.setHeader('Cache-Control', 'no-cache')
        response.setHeader('Connection', 'keep-alive')
        response.setHeader('X-Accel-Buffering', 'no')

        try
        {
            const stream = this.articlesService.generateArticle(generateArticleDto)

            for await (const chunk of stream)
            {
                // Send each chunk as an SSE event
                response.write(`data: ${JSON.stringify({ chunk })}\n\n`)
            }

            // Send completion event
            response.write(`data: ${JSON.stringify({ done: true })}\n\n`)
            response.end()
        }
        catch (error)
        {
            // Send error event
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            response.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
            response.end()
        }
    }
}
