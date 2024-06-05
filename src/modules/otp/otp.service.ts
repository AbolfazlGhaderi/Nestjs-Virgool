import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';
import { AuthMessage, BadRequestMesage, TokenType } from 'src/common/enums';

@Injectable()
export class OtpService {
   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

   // generate code
   generateOtp() {
      return randomInt(10000, 99999);
   }

   async deleteByKey(key: string) {
      await this.cacheManager.del(key);
      return;
   }

   async SaveLoginOTP(key: string, code: number) {
      // Generate Code

      key = `${key}:Login-otp`;

      console.log(key + '  ' + code);
      // check If Otp Is Exist In Cache
      let otp = await this.cacheManager.get(key);
      if (otp) {
         await this.cacheManager.del(key);
      }

      // Save Code To Cache
      await this.cacheManager.set(key, code);

      return code;
   }

   async checkOtp(key: string , type :  string) {

      let code: number | undefined = await this.cacheManager.get(key);
      if (!code) {
         if(type === TokenType.Login)
         throw new UnauthorizedException(AuthMessage.expiredOtp);
      else if(type === TokenType.ChangeOtp){
         throw new ForbiddenException(AuthMessage.expiredOtp);

      }
      }else{
         
         return code.toString();
      }

   }

   // change email ------===>
   async sendAndSaveEmailOTP(email: string) {
      let key = `${email}:Change-otp`;
      const code = this.generateOtp();
      // check If Otp Is Exist In Cache
      let otp = await this.cacheManager.get(key);
      if (otp) {
         throw new BadRequestException(BadRequestMesage.saveEmailOtp);
      }

      // send code to email

      // Save Code To Cache
      await this.cacheManager.set(key, code);
      console.log(key + ' ==>  ' + code);

      return code;
   }

}
