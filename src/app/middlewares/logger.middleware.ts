import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware
{
   private logger = new Logger('HTTP');
   use(request: Request, response: Response, next: NextFunction)
   {
       const { ip, method, baseUrl } = request;
       const userAgent = request.get('user-agent') || '';
       const startAt = process.hrtime();

       response.on('finish', () =>
       {
           const { statusCode } = response;
           const contentLength = response.get('content-length');
           const dif = process.hrtime(startAt);
           const responseTime = dif[0] * 1e3 + dif[1] * 1e-6;
           this.logger.log(`${method} | ${baseUrl} | ${statusCode} | ${contentLength} - ${userAgent} | ${ip} | ${responseTime.toFixed(2)}ms`);
       });

       next();
   }
}
