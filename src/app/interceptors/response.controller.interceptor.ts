/* eslint-disable @typescript-eslint/no-explicit-any */


import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import dayjs from 'dayjs'
import { Response } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { DefaultSuccessResponseT } from '@/common/types'



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
                const responseObject: DefaultSuccessResponseT = {
                    ok: true,
                    statusCode: statusCode,
                    timestamp: Date.now(),
                    data: {},
                }
                if (data && data.data !== undefined)
                {
                    responseObject['data'] =  data.data
                }
                else
                    responseObject['data'] =  data

                // this.logger.log(`RequestId: ${requestId}  | path: ${context.switchToHttp().getRequest<Request>().path} | Response Time: ${responseTime.toFixed(2)}ms`)
                return responseObject
            }),
        )
    }
}
