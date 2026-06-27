/* eslint-disable @typescript-eslint/no-explicit-any */


import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import dayjs from 'dayjs'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'



@Injectable()
export class ResponseControllerInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>
    {
        const ctx = context.switchToHttp().getResponse<Response>()
        const statusCode = ctx.statusCode

        return next.handle().pipe(
            map((data) =>
            {
                const date = dayjs()
                if (data && data.data !== undefined)
                {
                    return {
                        statusCode: statusCode,
                        timestamp: date.unix(),
                        data: data.data,
                    }
                }
                return {
                    statusCode: statusCode,
                    timestamp: date.unix(),
                    data: data,
                }
            }),
        )
    }
}
