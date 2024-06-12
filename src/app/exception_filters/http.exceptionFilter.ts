import * as dayjs from 'dayjs';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      const responseData = exception.getResponse();
      let message: string | string[];

      if (typeof responseData === 'object' && Reflect.has(responseData, 'message')) {
         message = Reflect.get(responseData, 'message');
      } else if (typeof responseData === 'string') {
         message = responseData;
      } else {
         message = 'something wrong';
      }

      const date = dayjs();
      response.status(status).json({
         statusCode: status,
         timestamp: date.unix(),
         error: {
            message: message
         }
      });
   }
}
