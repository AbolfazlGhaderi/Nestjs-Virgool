import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';
import { AuthMessage } from 'src/common/enums';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // generate code
  generateOtp() {
    return randomInt(10000, 99999);
  }

  async deleteByKey(key:string){
    await this.cacheManager.del(key)
    return ;

  }

  async SaveOTP(key: string, code: number) {
    // Generate Code

    key = `${key}:Login-otp`;

    console.log(key +'  '+ code);
    // check If Otp Is Exist In Cache
    let otp = await this.cacheManager.get(key);
    if (otp) {

      await this.cacheManager.del(key);
    }

    // Save Code To Cache
    await this.cacheManager.set(key, code);

    return code;
  }



  async checkOtp( key: string ) {

    key = `${key}:Login-otp`;
    let code: number | undefined = await this.cacheManager.get(key);
    if(!code)
      {
        throw new UnauthorizedException(AuthMessage.expiredOtp)

      }

    return code.toString()
  }


}
