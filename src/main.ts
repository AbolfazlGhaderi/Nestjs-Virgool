import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('Public')
  app.use(cookieParser(process.env.COOKIE_SECRET))
  SwaggerConfig(app)
  app.useGlobalPipes( new ValidationPipe())
  await app.listen(process.env.PORT);
}
bootstrap();
