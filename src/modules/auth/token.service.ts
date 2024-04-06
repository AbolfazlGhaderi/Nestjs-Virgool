import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  createOtpToken(payload: any) {
      const token = this.jwtService.sign(payload,{
        secret: process.env.OTP_TOKEN_SECRET,
        expiresIn: '2m'
      })

      return token
  }
}
