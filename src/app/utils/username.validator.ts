import { HttpException, HttpStatus } from '@nestjs/common';
import { isEmail, isMobilePhone } from 'class-validator';
import { AuthMethods, BadRequestMesage } from 'src/common/enums';

export function UsernameValidator(username: string, method: AuthMethods) {
   switch (method) {
      case AuthMethods.Email:
         if (isEmail(username)) return username.trim().toLowerCase();
         throw new HttpException(BadRequestMesage.emailFormatIncorrect, HttpStatus.BAD_REQUEST);

      case AuthMethods.Phone:
         if (isMobilePhone(username, 'fa-IR')) return username;
         throw new HttpException(BadRequestMesage.mobileNumberIncorrect, HttpStatus.BAD_REQUEST);

      case AuthMethods.Username:
         return username.trim().toLowerCase();
      default:
         throw new HttpException(BadRequestMesage.inValidData, HttpStatus.BAD_REQUEST);
   }
}
