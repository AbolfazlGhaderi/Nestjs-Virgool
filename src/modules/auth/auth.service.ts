import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthMessage, AuthMethods, AuthType, BadRequestMesage, CookieKeys, PublicMessage, TokenType } from 'src/common/enums';
import { UsernameValidator } from 'src/app/utils/username.validator';
import { UserEntity } from 'src/app/models';
import { UserService } from 'src/modules/user/user.service';
import { OtpService } from '../otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../token/token.service';
import { Request, Response } from 'express';
import { symmetricCryption } from 'src/app/utils/encrypt.decript';
import { LoginResponseType } from 'src/common/types';
import { REQUEST } from '@nestjs/core';
import { isMobilePhone } from 'class-validator';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
   constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly userService: UserService,
      private readonly otpService: OtpService,
      private readonly tokenService: TokenService,
      @Inject(REQUEST) private request: Request
   ) {}

   async userExistenceS(authData: AuthDto, res: Response) {
      const { method, type, username } = authData;

      const validUserName = UsernameValidator(username, method);
      let result: LoginResponseType;

      switch (type) {
         // Login
         case AuthType.Login:
            result = await this.login(method, validUserName);
            break;
         // Register
         case AuthType.Register:
            result = await this.register(method, validUserName);
            break;
         default:
            throw new HttpException(BadRequestMesage.inValidData, HttpStatus.UNAUTHORIZED);
      }

      // Send Response

      return {
         token: result.token,
         message: PublicMessage.sendOtpSuccess
      };
   }

   // Login
   async login(method: AuthMethods, username: string) {
      // check Exist User
      const user: UserEntity = await this.checkExistUser(method, username);
      if (!user) throw new HttpException(AuthMessage.notFoundAccount, HttpStatus.NOT_FOUND);

      let otp: number;
      let token: string;

      const userNameEncrypted = symmetricCryption.encryption(username, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

      if (method === AuthMethods.Email) {
         otp = this.otpService.generateOtp();

         // send otp

         // save otp
         otp = await this.otpService.SaveLoginOTP(username, otp);

         // Generate Token
         token = this.tokenService.createOtpToken({
            sub: userNameEncrypted
         });
      } else if (method === AuthMethods.Phone) {
         otp = this.otpService.generateOtp();

         // send otp

         // save otp
         otp = await this.otpService.SaveLoginOTP(username, otp);

         // Generate Token
         token = this.tokenService.createOtpToken({
            sub: userNameEncrypted
         });
      } else {
         throw new HttpException('Please select a valid method', HttpStatus.BAD_REQUEST);
      }

      return {
         token: token,
         code: otp.toString()
      };
   }

   // Register
   async register(method: AuthMethods, username: string) {
      if (method === AuthMethods.Username) throw new HttpException(BadRequestMesage.registerMethodIncorrect, HttpStatus.BAD_REQUEST);

      let user: UserEntity = await this.checkExistUser(method, username);
      if (user) throw new HttpException(AuthMessage.alreadyExistAccount, HttpStatus.CONFLICT);

      const newUser = this.userRepository.create({
         username: `U_${username}`,
         [method]: username
      });

      user = await this.userRepository.save(newUser);

      // ---------------------------------------------
      const userNameEncrypted = symmetricCryption.encryption(username, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

      let otp: number;
      let token: string;
      if (method === AuthMethods.Email) {
         otp = this.otpService.generateOtp();

         // send otp

         // save otp
         otp = await this.otpService.SaveLoginOTP(username, otp);

         // Generate Token
         token = this.tokenService.createOtpToken({
            sub: userNameEncrypted
         });
      } else if (method === AuthMethods.Phone) {
         otp = this.otpService.generateOtp();

         // send otp

         // save otp
         otp = await this.otpService.SaveLoginOTP(username, otp);

         // Generate Token
         token = this.tokenService.createOtpToken({
            sub: userNameEncrypted
         });
      } else {
         throw new HttpException('Please select a valid method', HttpStatus.BAD_REQUEST);
      }
      // ----------------------

      return {
         token: token,
         code: otp.toString()
      };
   }

   // Check Otp / Service
   async checkOtpS(otpCode: string) {
      // get Token from Cookie
      const token = this.request.cookies?.[CookieKeys.OTP];
      if (!token) throw new HttpException(AuthMessage.expiredOtp, HttpStatus.UNAUTHORIZED);

      //  username decrypt
      const payload = this.tokenService.verifyOtpToken(token, TokenType.Login);
      let key = symmetricCryption.decrypted(payload.sub, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

      // get code from Cach and check
      const code = await this.otpService.checkOtp(`${key}:Login-otp`, TokenType.Login);

      if (otpCode !== code) throw new HttpException(AuthMessage.otpCodeIncorrect, HttpStatus.UNAUTHORIZED);

      // delete otp from cache
      await this.otpService.deleteByKey(`${key}:Login-otp`);

      // check username is phone or email
      let user;
      if (isMobilePhone(key, 'fa-IR')) {
         user = await this.userRepository.findOne({ where: { phone: key } });
      } else {
         user = await this.userRepository.findOne({ where: { email: key } });
      }
      user = user as UserEntity;
      // encrypt userID
      const sub = symmetricCryption.encryption(user.id.toString(), process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

      // Create Access Tonken
      const accessToken = this.tokenService.createAccessToken({
         sub: sub
      });

      // return
      return {
         accessToken: accessToken,
         message: PublicMessage.loginSucces
      };
   }

   //check Exist User
   async checkExistUser(method: string, username: string) {
      let user;

      switch (method) {
         case AuthMethods.Email:
            user = await this.userService.findUserByEmail(username);
            break;
         case AuthMethods.Phone:
            user = await this.userService.findUserByPhone(username);
            break;
         case AuthMethods.Username:
            user = await this.userService.findUserByUserName(username);

            break;
         default:
            throw new HttpException(BadRequestMesage.inValidData, HttpStatus.BAD_REQUEST);
      }

      user = user as UserEntity;
      return user;
   }
}
