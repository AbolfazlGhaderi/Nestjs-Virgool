

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, timestamp } from 'rxjs/operators';
import { Response } from 'express';
import * as dayjs from 'dayjs';



@Injectable()
export class ResponseControllerInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>
    {
        const ctx = context.switchToHttp().getResponse<Response>();
        const statusCode = ctx.statusCode;

        return next.handle().pipe(
            map((data) =>
            {
                const date = dayjs();
                if (data && data.data !== undefined)
                {
                    return {
                        statusCode: statusCode,
                        timestamp: date.unix(),
                        data: data.data,
                    };
                }
                return {
                    statusCode: statusCode,
                    timestamp: date.unix(),
                    data: data,
                };
            }),
        );
    }
}
