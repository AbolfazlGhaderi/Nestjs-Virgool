import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateAndSaveOTP(phone?: string, email?: string) {
    // Generate Code
    const code = randomInt(10000, 99999);
    let key = '';

    if (phone) {
      key = `${phone}:Login:otp`;
    }
    if (email) {
      key = `${email}:Login:otp`;
    }

    // check If Otp Is Exist In Cache
    let otp = await this.cacheManager.get(key);
    if (otp) {
      await this.cacheManager.del(key);
    }

    // Save Code To Cache
    otp = await this.cacheManager.set(key, code);
    console.log(otp);

    return code;
  }

  async checkOtp(code: string) {

  }
}
