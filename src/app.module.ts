import { MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggerMiddleware } from './app/middlewares'
import { typeOrmConfig } from './configs'
import { AuthModule } from './modules/auth/auth.module'
import { BlogModule } from './modules/blog/blog.module'
import { CategoryModule } from './modules/category/category.module'
import { CommentModule } from './modules/comment/comment.module'
import { MailModule } from './modules/mail/mail.module'
import { OtpModule } from './modules/otp/otp.module'
import { TokenModule } from './modules/token/token.module'
import { UploadeModule } from './modules/upload/uploade.module'
import { UserModule } from './modules/user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: (process.cwd(), '.env'),
        }),
        TypeOrmModule.forRoot(typeOrmConfig()),
        AuthModule,
        UserModule,
        OtpModule,
        TokenModule,
        CategoryModule,
        BlogModule,
        UploadeModule,
        CommentModule,
        MailModule,
    ],
    controllers: [],
    providers: [ AuthModule ],
})

export class AppModule implements NestModule
{
    configure(consumer: MiddlewareConsumer)
    {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
