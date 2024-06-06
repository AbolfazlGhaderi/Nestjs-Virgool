import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthMessage, TokenType } from 'src/common/enums';
import { AccessTokenPayload, OtpCookiePayload } from 'src/common/types/auth/payload.type';
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

   createChanegToken(payload: OtpCookiePayload) {
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
      const user = this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new HttpException(AuthMessage.loginAgain, HttpStatus.UNAUTHORIZED);

      return user;
   }

   verifyAccessToken(token: string): AccessTokenPayload {
      try {
         return this.jwtService.verify(token, {
            secret: process.env.ACCESS_TOKEN_SECRET
         });
      } catch (error) {
         throw new HttpException(AuthMessage.loginAgain, HttpStatus.UNAUTHORIZED);
      }
   }

   verifyOtpToken(token: string, type: string): { sub: string } {
      try {
         if (type === TokenType.Login) {
            return this.jwtService.verify(token, {
               secret: process.env.OTP_TOKEN_SECRET
            });
         } else if (type === TokenType.ChangeOtp) {
            return this.jwtService.verify(token, {
               secret: process.env.EMAIL_TOKEN_SECRET
            });
         }
      } catch (error) {
         if (type === TokenType.Login) {
            throw new HttpException(AuthMessage.loginAgain, HttpStatus.UNAUTHORIZED);
         } else if (type === TokenType.ChangeOtp) {
            throw new HttpException(AuthMessage.expiredOtp,HttpStatus.FORBIDDEN);
         }
      }
      return { sub: '' };
   }
}
