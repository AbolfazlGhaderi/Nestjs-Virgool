import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common'

import { AI_PROVIDER_TOKEN } from '../../../ai/ai.module'
import { GenerateArticleDto } from '../dto/generate-article.dto'

interface IAIProvider
{
    generateArticle(topic: string, extraPrompt?: string): AsyncIterable<string>
}

@Injectable()
export class ArticlesService
{
    private readonly logger = new Logger(ArticlesService.name)

    constructor(
        @Inject(AI_PROVIDER_TOKEN) private readonly aiProvider: IAIProvider,
    ) {}

    /**
     * Generate an article based on the provided topic and extra instructions
     * @param generateArticleDto - The article generation request
     * @returns An async iterable of content chunks for streaming
     * @throws HttpException if article generation fails
     */
    async *generateArticle(generateArticleDto: GenerateArticleDto): AsyncIterable<string>
    {
        const { topic, extraPrompt } = generateArticleDto

        try
        {
            this.logger.log(`Starting article generation for topic: ${topic}`)

            // Generate article using AI provider and stream chunks
            yield* this.aiProvider.generateArticle(topic, extraPrompt)

            this.logger.log('Article generation completed')
        }
        catch (error)
        {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            this.logger.error(`Failed to generate article: ${errorMessage}`)

            // Re-throw HttpException if it's already one
            if (error instanceof HttpException)
            {
                throw error
            }

            // Wrap other errors in HttpException
            throw new HttpException(
                'Failed to generate article',
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
