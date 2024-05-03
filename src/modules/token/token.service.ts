import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMessage } from 'src/common/enums';
import { AccessTokenPayload, OtpCookiePayload } from 'src/common/types/auth/payload.type';
import { UserService } from '../user/user.service';
import { symmetricCryption } from 'src/app/utils/encrypt.decript';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
   constructor(
      private readonly jwtService: JwtService,
      // private readonly userService: UserService
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>
   ) {}

   // -------------------- OTP Token -------------------------------- ===>
   createOtpToken(payload: OtpCookiePayload) {
      const token = this.jwtService.sign(payload, {
         secret: process.env.OTP_TOKEN_SECRET,
         expiresIn: '2m'
      });

      return token;
   }

   verifyOtpToken(token: string): OtpCookiePayload {
      try {
         return this.jwtService.verify(token, {
            secret: process.env.OTP_TOKEN_SECRET
         });
      } catch (error) {
         throw new UnauthorizedException(AuthMessage.loginAgain);
      }
   }

   createTokenChangeEmail(payload: OtpCookiePayload) {
      return this.jwtService.sign(payload, {
         secret: process.env.EMAIL_TOKEN_SECRET,
         expiresIn: '2m'
      });
   }
   // -------------------- Access Token ----------------------------- ===>

   createAccessToken(payload: AccessTokenPayload) {
      const token = this.jwtService.sign(payload, {
         secret: process.env.ACCESS_TOKEN_SECRET,
         expiresIn: '10d'
      });

      return token;
   }

   // ------------------ Verify ------------------------------------- ===>
   validateAccessToken(token: string) {
      const { sub } = this.verifyAccessToken(token);

      // userId decrypted
      let userId = symmetricCryption.decrypted(sub, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

      // check exist user
      const user = this.userRepository.findOne({ where: { id: +userId } });
      if (!user) throw new UnauthorizedException(AuthMessage.loginAgain);

      return user;
   }

   verifyAccessToken(token: string): AccessTokenPayload {
      try {
         return this.jwtService.verify(token, {
            secret: process.env.ACCESS_TOKEN_SECRET
         });
      } catch (error) {
         throw new UnauthorizedException(AuthMessage.loginAgain);
      }
   }
}
