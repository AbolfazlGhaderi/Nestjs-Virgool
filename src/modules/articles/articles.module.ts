import { Module } from '@nestjs/common'

import { AiModule } from '../../ai/ai.module'
import { ArticlesController } from './articles.controller'
import { ArticlesService } from './services/articles.service'

@Module({
    imports: [AiModule],
    controllers: [ArticlesController],
    providers: [ArticlesService],
})
export class ArticlesModule {}
