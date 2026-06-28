/**
 * Interface for AI providers
 * This allows for easy replacement of AI providers (OpenRouter, OpenAI, Gemini, Claude, etc.)
 */
export interface IAIProvider
{
    /**
     * Generate an article based on the provided topic and extra instructions
     * @param topic - The main topic of the article
     * @param extraPrompt - Additional instructions from the client (optional)
     * @returns An async iterable of content chunks for streaming
     * @throws Error if the AI provider fails to generate the article
     */
    generateArticle(topic: string, extraPrompt?: string): AsyncIterable<string>
}
