import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { randomInt } from 'crypto'

import { GenerateOtpSubject } from '../../app/utils/functions.utils'
import { AuthMessage, BadRequestMesage, TokenType } from '../../common/enums'
import { OtpKey } from '../../common/enums/otp.keys.enum'
import { SmsService } from '../../common/services/sms.service'
import { MailService } from '../mail/mail.service'

@Injectable()
export class OtpService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly mailService:MailService,
        private readonly smsService:SmsService,
    ) {}

    // generate code
    generateOtp()
    {
        return randomInt(10_000, 99_999)
    }

    async deleteByKey(key: string)
    {
        await this.cacheManager.del(key)
        return
    }

    async SaveLoginOTP(key: string, code: number)
    {
        // Generate Code

        console.log(key + '  ' + code)
        // check If Otp Is Exist In Cache
        const otp = await this.cacheManager.get(key)
        if (otp)
        {
            await this.cacheManager.del(key)
        }

        // Save Code To Cache
        await this.cacheManager.set(key, code)

        return code
    }

    async GetOtp(key: string, type?: TokenType)
    {
        const code: number | undefined = await this.cacheManager.get(key)
        if (code)
        {
            return code.toString()
        }
        else
        {
            if (type && type === TokenType.Login) throw new UnauthorizedException(AuthMessage.ExpiredOtp)
            else
            {
                throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN)
            }
        }
    }


    async sendAndSaveOTP(content: string, otpkey:OtpKey, type: 'email'|'phone')
    {
        const key = `${content}${otpkey}`
        const code = this.generateOtp()
        // check If Otp Is Exist In Cache
        const otp = await this.cacheManager.get(key)
        if (otp)
        {
            throw new HttpException(BadRequestMesage.SaveOtp, HttpStatus.BAD_REQUEST)
        }

        // send code to Email or Phone

        if (type === 'email')
        {
            await this.mailService.SendEmail('', content, GenerateOtpSubject(otpkey), `Code : ${code} `, `<h1>Code : ${code} </h1>`)
        }
        if (type === 'phone')
        {
            await this.smsService.sendOtpCode(content, code.toString())
        }
        else
        {
            throw new HttpException('Invalid OTP type', HttpStatus.BAD_REQUEST)
        }

        // Save Code To Cache
        await this.cacheManager.set(key, code)
        console.log(key + ' ==>  ' + code)  // TODO: Remove It

        return code
    }
}
