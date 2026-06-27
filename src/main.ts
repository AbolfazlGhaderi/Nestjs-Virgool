import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './app/exceptionFilters/http.exceptionFilter'
import { ResponseControllerInterceptor } from './app/interceptors/response.controller.interceptor'
import { SwaggerConfig } from './configs'

async function bootstrap()
{
    // Create App
    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    // use 
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
    app.useStaticAssets('Public')
    app.use(cookieParser(process.env.COOKIE_SECRET))
    SwaggerConfig(app)
    app.useGlobalPipes( new ValidationPipe())
    app.useGlobalInterceptors(new ResponseControllerInterceptor())
    app.useGlobalFilters(new HttpExceptionFilter())

    // App Listen
    const PORT = process.env.PORT || 3000
    await app.listen(PORT)

    // logs
    console.log(`app :  http://localhost:${PORT}`)
    console.log(`Swagger :  http://localhost:${PORT}/api`)
}

void bootstrap()
