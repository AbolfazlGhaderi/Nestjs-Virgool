import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenRouter } from '@openrouter/sdk'

import { ARTICLE_SYSTEM_PROMPT } from '../prompts/article.prompt'
import { IAIProvider } from './ai-provider.interface'

@Injectable()
export class OpenRouterProvider implements IAIProvider
{
    private readonly openrouter: OpenRouter
    private readonly logger = new Logger(OpenRouterProvider.name)
    private readonly apiKey: string
    private readonly model: string

    constructor(private readonly configService: ConfigService)
    {

        this.apiKey = process.env.OPENROUTER_API_KEY!
        this.model = process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-120b:free'

        if (!this.apiKey)
        {
            throw new Error('OPENROUTER_API_KEY is not configured in environment variables')
        }

        if (!this.model)
        {
            throw new Error('OPENROUTER_MODEL is not configured in environment variables')
        }

        this.openrouter = new OpenRouter({
            apiKey: this.apiKey,
        })
    }

    async *generateArticle(topic: string, extraPrompt?: string): AsyncIterable<string>
    {
        try
        {
            this.logger.log(`Generating article for topic: ${topic}`)

            // Build the complete prompt
            let prompt = ARTICLE_SYSTEM_PROMPT
            prompt += '\n\nموضوع مقاله: ' + topic

            if (extraPrompt && extraPrompt.trim().length > 0)
            {
                prompt += '\n\nدستورالعمل‌های اضافی: ' + extraPrompt
            }

            prompt += '\n\nلطفاً مقاله را به زبان فارسی و با فرمت HTML تولید کنید.'

            const stream = await this.openrouter.chat.send({
                chatRequest: {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    stream: true,
                },
            })

            for await (const chunk of stream)
            {
                const content = chunk.choices[0]?.delta?.content
                if (content)
                {
                    yield content
                }

                // Usage information comes in the final chunk
                if (chunk.usage)
                {
                    this.logger.log(`Total tokens: ${chunk.usage.totalTokens}`)
                }
            }

            this.logger.log('Article generation completed')
        }
        catch (error)
        {
            console.log(error)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            this.logger.error(`Failed to generate article: ${errorMessage}`)

            if (errorMessage.includes('401') || errorMessage.includes('unauthorized'))
            {
                throw new HttpException(
                    'Invalid OpenRouter API key',
                    HttpStatus.UNAUTHORIZED,
                )
            }
            if (errorMessage.includes('429') || errorMessage.includes('rate limit'))
            {
                throw new HttpException(
                    'OpenRouter API rate limit exceeded',
                    HttpStatus.TOO_MANY_REQUESTS,
                )
            }
            if (errorMessage.includes('500') || errorMessage.includes('service unavailable'))
            {
                throw new HttpException(
                    'OpenRouter service unavailable',
                    HttpStatus.SERVICE_UNAVAILABLE,
                )
            }

            if (errorMessage.includes('timeout'))
            {
                throw new HttpException(
                    'AI provider request timed out',
                    HttpStatus.REQUEST_TIMEOUT,
                )
            }

            throw new HttpException(
                'Failed to generate article',
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
