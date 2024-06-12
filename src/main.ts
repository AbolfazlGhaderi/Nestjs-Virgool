import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './configs';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loggerMiddleware } from './app/middlewares';
import { ResponseControllerInterceptor } from './app/interceptors/response.controller.interceptor';
import { HttpExceptionFilter } from './app/exception_filters/http.exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('Public')
  app.use(cookieParser(process.env.COOKIE_SECRET))
  SwaggerConfig(app)
  app.useGlobalPipes( new ValidationPipe())
  app.useGlobalInterceptors(new ResponseControllerInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  const PORT = process.env.PORT
  await app.listen(PORT);
  console.log(`app :  http://localhost:${PORT}`);
  console.log(`Swagger :  http://localhost:${PORT}/api`);
}
bootstrap();
