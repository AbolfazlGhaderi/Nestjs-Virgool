import { HttpException, HttpStatus } from '@nestjs/common';
import { isEmail, isMobilePhone } from 'class-validator';
import { AuthMethods, BadRequestMesage } from '../../common/enums';

export function UsernameValidator(username: string, method: AuthMethods)
{
    switch (method)
    {
        case AuthMethods.Email: {
            if (isEmail(username)) return username.trim().toLowerCase();
            throw new HttpException(BadRequestMesage.EmailFormatIncorrect, HttpStatus.BAD_REQUEST);
        }

        case AuthMethods.Phone: {
            if (isMobilePhone(username, 'fa-IR')) return username;
            throw new HttpException(BadRequestMesage.MobileNumberIncorrect, HttpStatus.BAD_REQUEST);
        }

        case AuthMethods.Username: {
            return username.trim().toLowerCase();
        }
        default: {
            throw new HttpException(BadRequestMesage.InValidData, HttpStatus.BAD_REQUEST);
        }
    }
}
