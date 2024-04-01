import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { isEmail, isMobilePhone } from 'class-validator';
import { AuthMethods } from 'src/common/enums';

export function UsernameValidator(username: string, method: AuthMethods) {

    switch(method){
        case AuthMethods.Email:
            if(isEmail(username)) return username
            throw new BadRequestException('Email format incorrect')
        case AuthMethods.Phone:
            if(isMobilePhone(username,'fa-IR')) return username
            throw new BadRequestException('mobile number incorrect')
        case AuthMethods.Username: return username
        default:
            throw new UnauthorizedException('username data is not valid')
    }
}
