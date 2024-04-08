import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import {
  AuthMessage,
  AuthMethods,
  AuthType,
  BadRequestMesage,
  CookieKeys,
  PublicMessage,
} from 'src/common/enums';
import { UsernameValidator } from 'src/app/utils/username.validator';
import { UserEntity } from 'src/app/models';
import { UserService } from 'src/modules/user/user.service';
import { OtpService } from '../otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { symmetricCryption } from 'src/app/utils/encrypt.decript';
import { LoginResponseType } from 'src/common/types';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    @Inject(REQUEST) private request: Request,
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
        throw new UnauthorizedException(BadRequestMesage.inValidData);
    }

    // Send Response

    return {
      token: result.token,
      message: PublicMessage.sendOtpSuccess,
    };
  }

  // Login
  async login(method: AuthMethods, username: string) {
    // check Exist User
    const user: UserEntity = await this.checkExistUser(method, username);
    if (!user) throw new NotFoundException(AuthMessage.notFoundAccount);

    let otp: number;
    let token: string;

    const userNameEncrypted = symmetricCryption.encryption(
      username,
      process.env.ENCRYPT_SECRET,
      process.env.ENCRYPT_IV,
    );

    if (method === AuthMethods.Email) {
      otp = this.otpService.generateOtp();

      // send otp

      // save otp
      otp = await this.otpService.SaveOTP(username, otp);

      // Generate Token
      token = this.tokenService.createOtpToken({
        sub: userNameEncrypted,
      });
    } else if (method === AuthMethods.Phone) {
      otp = this.otpService.generateOtp();

      // send otp

      // save otp
      otp = await this.otpService.SaveOTP(username, otp);

      // Generate Token
      token = this.tokenService.createOtpToken({
        sub: userNameEncrypted,
      });
    }

    return {
      token: token,
      code: otp.toString(),
    };
  }

  // Register
  async register(method: AuthMethods, username: string) {

    if (method === AuthMethods.Username)
      throw new BadRequestException(BadRequestMesage.registerMethodIncorrect);

    let user: UserEntity = await this.checkExistUser(method, username);
    if (user) throw new ConflictException(AuthMessage.alreadyExistAccount);

    const newUser = this.userRepository.create({
      username: `U_${username}`,
      [method]: username,
    });

    user = await this.userRepository.save(newUser);

    // ---------------------------------------------
    const userNameEncrypted = symmetricCryption.encryption(
      username,
      process.env.ENCRYPT_SECRET,
      process.env.ENCRYPT_IV,
    );

    let otp: number;
    let token: string;
    if (method === AuthMethods.Email) {
      otp = this.otpService.generateOtp();

      // send otp

      // save otp
      otp = await this.otpService.SaveOTP(username, otp);

      // Generate Token
      token = this.tokenService.createOtpToken({
        sub: userNameEncrypted,
      });
    } else if (method === AuthMethods.Phone) {
      otp = this.otpService.generateOtp();

      // send otp

      // save otp
      otp = await this.otpService.SaveOTP(username, otp);

      // Generate Token
      token = this.tokenService.createOtpToken({
        sub: userNameEncrypted,
      });
    }
    // ----------------------

    return {
      token: token,
      code: otp.toString(),
    };
  }

  // Check Otp / Service
  async checkOtpS(otpCode: string) {
    
    // get Token from Cookie
    const token = this.request.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.expiredOtp);

    //  username decrypt
    const payload = this.tokenService.verifyOtpToken(token);
    let key = symmetricCryption.decrypted(
      payload.sub,
      process.env.ENCRYPT_SECRET,
      process.env.ENCRYPT_IV,
    );

    // get code from Cach and check
    const code = await this.otpService.checkOtp(key);

    if (otpCode !== code)
      throw new UnauthorizedException(AuthMessage.otpCodeIncorrect);

    // delete otp from cache
    await this.otpService.deleteByKey(`${key}:Login-otp`)

    // return 
    return {
      message: PublicMessage.loginSucces,
    };
  }

  //check Exist User
  async checkExistUser(method: string, username: string) {
    let user: UserEntity;

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
        throw new BadRequestException(BadRequestMesage.inValidData);
    }

    return user;
  }
}
