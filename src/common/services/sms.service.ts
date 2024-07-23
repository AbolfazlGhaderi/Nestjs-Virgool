import axios, { AxiosRequestConfig } from 'axios';
import { ServiceUnavailableMessage } from '../enums/index';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';


@Injectable()
export class SmsService
{
    private  endpoint = process.env.SMS_ENDPOINT_VERIFY;
    private  apiKey = process.env.SMS_API_KEY;
    private  templateId = process.env.SMS_TEMPLATEID;

    async sendOtpCode(mobile: string, otpCode: string)
    {
        const smsData = {
            mobile,
            templateId: this.templateId,
            parameters: [ { name: 'code', value: otpCode } ],
        };

        const axiosConfig: AxiosRequestConfig = {
            method: 'post',
            url: this.endpoint,
            headers: {
                'Content-Type': 'application/json',
                ACCEPT: 'application/json',
                'x-api-key': this.apiKey,
            },
            data: JSON.stringify(smsData),
        };

        try
        {
            const { data } = await axios(axiosConfig);
            if (data?.status !== 1) throw new HttpException(ServiceUnavailableMessage.SmsServiceUnavailable, HttpStatus.SERVICE_UNAVAILABLE);
            return data;
        }
        catch (error)
        {
            console.log(error);
            throw new HttpException(ServiceUnavailableMessage.SmsServiceUnavailable, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
