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
    @Inject(REQUEST) private request : Request
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
    res.cookie(CookieKeys.OTP, result.token, {
      httpOnly: true,
      expires: new Date(Date.now() + 120000),
    });
    return {
      message: PublicMessage.sendOtpSuccess,
      code: result.code,
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
    // if (method === AuthMethods.Username)
    //   throw new BadRequestException(BadRequestMesage.registerMethodIncorrect);
    // const user: UserEntity = await this.checkExistUser(method, username);
    // if (user) throw new ConflictException(AuthMessage.alreadyExistAccount);
    // const newUser = this.userRepository.create({ [method]: username });
    // console.log(newUser);
    // return 'ok';
    return {
      token: 'token',
      code: '35456',
    };
  }

  // Chek Otp Service
  async checkOtpS(code : string){
    const token = this.request.cookies?.[CookieKeys.OTP]
    if(!token) throw new  UnauthorizedException(AuthMessage.expiredOtp)
      return token
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
