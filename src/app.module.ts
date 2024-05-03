import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { OtpModule } from './modules/otp/otp.module';
import { CategoryModule } from './modules/category/category.module';
import { loggerMiddleware } from './app/middlewares';
import { TokenModule } from './modules/token/token.module';

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
    CategoryModule
  ],
  controllers: [],
  providers: [AuthModule],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes('*');
  }
}
