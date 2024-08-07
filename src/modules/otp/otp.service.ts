import { randomInt } from 'crypto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OtpKey } from '../../common/enums/otp.keys.enum';
import { AuthMessage, BadRequestMesage, TokenType } from '../../common/enums';
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OtpService
{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    // generate code
    generateOtp()
    {
        return randomInt(10_000, 99_999);
    }

    async deleteByKey(key: string)
    {
        await this.cacheManager.del(key);
        return;
    }

    async SaveLoginOTP(key: string, code: number)
    {
        // Generate Code

        key = `${key}${OtpKey.Login}`;

        console.log(key + '  ' + code);
        // check If Otp Is Exist In Cache
        const otp = await this.cacheManager.get(key);
        if (otp)
        {
            await this.cacheManager.del(key);
        }

        // Save Code To Cache
        await this.cacheManager.set(key, code);

        return code;
    }

    async checkOtp(key: string, type: string)
    {
        const code: number | undefined = await this.cacheManager.get(key);
        if (code)
        {
            return code.toString();
        }
        else
        {
            if (type === TokenType.Login) throw new UnauthorizedException(AuthMessage.ExpiredOtp);
            else if (type === TokenType.Change)
            {
                throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);
            }
        }
    }

    // change email ------===>
    async sendAndSaveEmailOTP(email: string)
    {
        const key = `${email}${OtpKey.Change}`;
        const code = this.generateOtp();
        // check If Otp Is Exist In Cache
        const otp = await this.cacheManager.get(key);
        if (otp)
        {
            throw new HttpException(BadRequestMesage.SaveOtp, HttpStatus.BAD_REQUEST);
        }

        // send code to email

        // Save Code To Cache
        await this.cacheManager.set(key, code);
        console.log(key + ' ==>  ' + code);

        return code;
    }

    // Verify Email ---------------------  ===>

    async sendAndSaveVerifyOTP(content: string, type: 'email'|'phone')
    {
        const key = `${content}${OtpKey.Verify}`;
        const code = this.generateOtp();
        // check If Otp Is Exist In Cache
        const otp = await this.cacheManager.get(key);
        if (otp)
        {
            throw new HttpException(BadRequestMesage.SaveOtp, HttpStatus.BAD_REQUEST);
        }

        // send code to Email or Phone

        if (type === 'email')
        {

        }
        else
        {

        }

        // Save Code To Cache
        await this.cacheManager.set(key, code);
        console.log(key + ' ==>  ' + code);

        return code;
    }
}
