import { AppModule } from './app.module';
import { SwaggerConfig } from './configs';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './app/exception_filters/http.exceptionFilter';
import { ResponseControllerInterceptor } from './app/interceptors/response.controller.interceptor';

async function bootstrap() {
  // Create App
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // use 
  app.useStaticAssets('Public')
  app.use(cookieParser(process.env.COOKIE_SECRET))
  SwaggerConfig(app)
  app.useGlobalPipes( new ValidationPipe())
  app.useGlobalInterceptors(new ResponseControllerInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  // App Listen
  const PORT = process.env.PORT
  await app.listen(PORT);

  //logs
  console.log(`app :  http://localhost:${PORT}`);
  console.log(`Swagger :  http://localhost:${PORT}/api`);
}

bootstrap();
