import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMessage } from 'src/common/enums';
import { OtpCookiePayload } from 'src/common/types/auth/payload.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createOtpToken(payload: OtpCookiePayload) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.OTP_TOKEN_SECRET,
      expiresIn: '2m',
    });

    return token;
  }

  verifyOtpToken(token: string) : OtpCookiePayload {

    try{

      return this.jwtService.verify(token, {
        secret: process.env.OTP_TOKEN_SECRET
      })
    }catch(error){
      throw new UnauthorizedException(AuthMessage.tryAgain)
    }
  }
}
