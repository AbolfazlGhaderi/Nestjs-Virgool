import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateAndSaveOTP(key: string) {
    
    // Generate Code
    const code = randomInt(10000, 99999);
    key = `${key}:Login:otp`;

    // check If Otp Is Exist In Cache
    let otp = await this.cacheManager.get(key);
    if (otp) {
      console.log(otp);
      await this.cacheManager.del(key);
    }

    // Save Code To Cache
     await this.cacheManager.set(key, code);

    return code;
  }

  async checkOtp(code: string) {

  }
}
