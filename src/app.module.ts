import { typeOrmConfig } from './configs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from './modules/otp/otp.module';
import { loggerMiddleware } from './app/middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { CategoryModule } from './modules/category/category.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ImagesModule } from './modules/image/images.module';

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
    ImagesModule
  ],
  controllers: [],
  providers: [AuthModule],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
