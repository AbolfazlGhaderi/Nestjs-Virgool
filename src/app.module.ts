import { typeOrmConfig } from './configs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from './modules/otp/otp.module';
import { LoggerMiddleware } from './app/middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { UserModule } from './modules/user/user.module';
import { MailModule } from './modules/mail/mail.module';
import { TokenModule } from './modules/token/token.module';
import { UploadeModule } from './modules/upload/uploade.module';
import { CategoryModule } from './modules/category/category.module';
import { MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { CommentModule } from './modules/comment/comment.module';

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
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
