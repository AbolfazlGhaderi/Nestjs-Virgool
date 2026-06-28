import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { OpenRouterProvider } from './providers/open-router.provider'

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER'

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: AI_PROVIDER_TOKEN,
            useClass: OpenRouterProvider,
        },
    ],
    exports: [AI_PROVIDER_TOKEN],
})
export class AiModule {}
