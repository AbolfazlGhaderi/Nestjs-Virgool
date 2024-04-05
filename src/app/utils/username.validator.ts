import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { isEmail, isMobilePhone } from 'class-validator';
import { AuthMethods, BadRequestMesage } from 'src/common/enums';

export function UsernameValidator(username: string, method: AuthMethods) {

    switch(method){
        
        case AuthMethods.Email:
            if(isEmail(username)) return username.toLowerCase()
            throw new BadRequestException(BadRequestMesage.emailFormatIncorrect)

        case AuthMethods.Phone:
            if(isMobilePhone(username,'fa-IR')) return username
            throw new BadRequestException(BadRequestMesage.mobileNumberIncorrect)

        case AuthMethods.Username: return username.toLowerCase()
        default:
            throw new UnauthorizedException(BadRequestMesage.inValidData)
    }
}
