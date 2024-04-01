import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfig(app)
  await app.listen(process.env.PORT);
}
bootstrap();