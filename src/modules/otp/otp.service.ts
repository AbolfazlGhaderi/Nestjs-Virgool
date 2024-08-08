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

    async checkOtp(key: string, type?: TokenType)
    {
        const code: number | undefined = await this.cacheManager.get(key);
        if (code)
        {
            return code.toString();
        }
        else
        {
            if (type && type === TokenType.Login) throw new UnauthorizedException(AuthMessage.ExpiredOtp);
            else
            {
                throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);
            }
        }
    }


    async sendAndSaveOTP(content: string, otpkey:OtpKey, type: 'email'|'phone')
    {
        const key = `${content}${otpkey}`;
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
        if (type === 'phone')
        {

        }
        else
        {}

        // Save Code To Cache
        await this.cacheManager.set(key, code);
        console.log(key + ' ==>  ' + code);

        return code;
    }
}
