import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfig(app)
  app.useGlobalPipes( new ValidationPipe())
  await app.listen(process.env.PORT);
}
bootstrap();
