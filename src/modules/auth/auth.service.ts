import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { UserEntity } from '../../app/models';
import { OtpService } from '../otp/otp.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { TOtpToken } from '../token/types/token.type';
import { TokenService } from '../token/token.service';
import { LoginResponseType } from '../../common/types';
import { GoogleUser } from './types/typesAndInterfaces';
import { isEmail, isMobilePhone } from 'class-validator';
import { OtpKey } from '../../common/enums/otp.keys.enum';
import { UserService } from '../../modules/user/user.service';
import { AuthDto, CheckRefreshTokenDto } from './dto/auth.dto';
import { SmsService } from '../../common/services/sms.service';
import { symmetricCryption } from '../../app/utils/encrypt.decrypt';
import { UsernameValidator } from '../../app/utils/username.validator';
import { GenerateOtpKey, GenerateOtpSubject } from '../../app/utils/functions.utils';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { AuthMessage, AuthMethods, AuthType, BadRequestMesage, CookieKeys, PublicMessage, ServiceUnavailableMessage, TokenType } from '../../common/enums';

@Injectable({ scope: Scope.REQUEST })
export class AuthService
{
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly userService: UserService,
      private readonly otpService: OtpService,
      private readonly tokenService: TokenService,
      private readonly smsService:SmsService,
      private readonly mailService:MailService,
      @Inject(REQUEST) private request: Request,
    ) {}

    async UserExistenceS(authData: AuthDto)
    {
        const { method, type, username } = authData;

        const validUserName = UsernameValidator(username, method);
        let result: LoginResponseType;

        switch (type)
        {
            // Login
            case AuthType.Login: {
                result = await this.login(method, validUserName);
                break;
            }
            // Register
            case AuthType.Register: {
                result = await this.register(method, validUserName);
                break;
            }
            default: {
                throw new HttpException(BadRequestMesage.InValidData, HttpStatus.UNAUTHORIZED);
            }
        }

        // Send Response

        return {
            token: result.token,
            message: PublicMessage.SendOtpSuccess,
        };
    }

    // Login
    async login(method: AuthMethods, username: string)
    {
        // check Exist User
        const user: UserEntity = await this.checkExistUser(method, username);
        if (!user) throw new HttpException(AuthMessage.NotFoundAccount, HttpStatus.NOT_FOUND);

        let otp: number;

        const userNameEncrypted = symmetricCryption.encryption(username, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        otp = this.otpService.generateOtp();

        // send otp
        if (method === AuthMethods.Email)
        {
            await this.mailService.SendEmail('', user.email, GenerateOtpSubject(OtpKey.Login), `Login => Code : ${otp} `, `<h1>Login => Code : ${otp} </h1>`);
        }
        else if (method === AuthMethods.Phone)
        {
            await this.smsService.sendOtpCode(username, otp.toString());
        }
        else
        {
            if (user.phone) await this.smsService.sendOtpCode(user.phone, otp.toString());
            else if (user.email)  await this.mailService.SendEmail('', user.email, GenerateOtpSubject(OtpKey.Login), `Login => Code : ${otp} `, `<h1>Login => Code : ${otp} </h1>`);
            else throw new HttpException(BadRequestMesage.InValidData, HttpStatus.BAD_REQUEST);
        }

        // save otp
        otp = await this.otpService.SaveLoginOTP(username, otp);

        // Generate Token
        const token = this.tokenService.createOtpToken({
            sub: userNameEncrypted,
        });

        return {
            token: token,
            code: otp.toString(),
        };
    }

    // Register
    async register(method: AuthMethods, username: string)
    {
        if (method === AuthMethods.Username) throw new HttpException(BadRequestMesage.RegisterMethodIncorrect, HttpStatus.BAD_REQUEST);

        const user: UserEntity = await this.checkExistUser(method, username);
        if (user) throw new HttpException(AuthMessage.AlreadyExistAccount, HttpStatus.CONFLICT);


        // encrypt username{phone/email} - Optional !!!!!
        const userNameEncrypted = symmetricCryption.encryption(username, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        let otp: number;
        let token: TOtpToken;
        if (method === AuthMethods.Email)
        {
            otp = this.otpService.generateOtp();

            // send otp
            await this.mailService.SendEmail('', username, GenerateOtpSubject(OtpKey.Login), `Login => Code : ${otp} `, `<h1>Login => Code : ${otp} </h1>`);

            // save otp
            otp = await this.otpService.SaveLoginOTP(username, otp);

            // Generate Token
            token = this.tokenService.createOtpToken({
                sub: userNameEncrypted,
            });
        }
        else if (method === AuthMethods.Phone)
        // TODO: Check This secction 
        {
            otp = this.otpService.generateOtp();

            // send otp
            await this.smsService.sendOtpCode(username, otp.toString());

            // save otp
            otp = await this.otpService.SaveLoginOTP(username, otp);

            // Generate Token
            token = this.tokenService.createOtpToken({
                sub: userNameEncrypted,
            });
        }
        else
        {
            throw new HttpException('Please select a valid method', HttpStatus.BAD_REQUEST);
        }
        // ----------------------

        return {
            token: token,
            code: otp.toString(),
        };
    }

    // Check Otp / Service
    async CheckOtpS(otpCode: string)
    {
        // get Token from Cookie
        const token:string = this.request.cookies?.[CookieKeys.OTP];
        if (!token) throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.UNAUTHORIZED);

        //  username decrypt
        const payload = this.tokenService.verifyOtpToken(token, TokenType.Login);
        const key = symmetricCryption.decrypted(payload.sub, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        // get code from Cach and check
        const code = await this.otpService.GetOtp(GenerateOtpKey(undefined, key), TokenType.Login);

        if (otpCode !== code) throw new HttpException(AuthMessage.OtpCodeIncorrect, HttpStatus.UNAUTHORIZED);

        // delete otp from cache
        await this.otpService.deleteByKey(`${key}${OtpKey.Login}`);

        //  find user
        let user : UserEntity | null;
        if (isMobilePhone(key, 'fa-IR'))
        {
            user = await this.userRepository.findOne({ where: { phone: key } });
            if (!user)
            {
                user = this.userRepository.create({
                    username: `u_${key}`,
                    phone: key,
                });
                user = await this.userRepository.save(user);
            }


        }
        else
        {
            user = await this.userRepository.findOne({ where: { email: key } });
            if (!user)
            {
                user = this.userRepository.create({
                    username: `U_${key}`,
                    email: key,
                });
                user = await this.userRepository.save(user);
            }
        }


        // encrypt userID
        const sub = symmetricCryption.encryption(user.id.toString(), process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        // Create Access Tonken
        const tokens = this.tokenService.generateAccessAndRefreshToken({
            sub: sub,
        });

        // return
        return {
            tokenType:'Bearer',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            message: PublicMessage.LoginSucces,
        };
    }

    // check Exist User
    async checkExistUser(method: string, username: string)
    {
        let user;

        switch (method)
        {
            case AuthMethods.Email: {
                user = await this.userService.findUserByEmail(username);
                break;
            }
            case AuthMethods.Phone: {
                user = await this.userService.findUserByPhone(username);
                break;
            }
            case AuthMethods.Username: {
                user = await this.userService.findUserByUserName(username);

                break;
            }
            default: {
                throw new HttpException(BadRequestMesage.InValidData, HttpStatus.BAD_REQUEST);
            }
        }

        user = user as UserEntity;
        return user;
    }

    // Check Refresh Token
    CheckRefreahTokenS( tokenData : CheckRefreshTokenDto )
    {
        return  this.tokenService.validateRefreshoken(tokenData.token);
    }

    // Google
    async GoogleRedirect(userData:GoogleUser)
    {
        const { email, firstName, lastName, profileImage } = userData;
        if (!email || !isEmail(email)) throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);

        let user = await this.userService.findUserByEmail(email);

        // Implements Register / Login

        if (!user)
        {
            // Register
            user = this.userRepository.create({
                email: email,
                username: firstName + ' ' + lastName,
            });

            user = await this.userRepository.save(user);

            // Save Profile
            if (userData.profileImage) await this.userService.CreateProfileFromGoogle(user, { image:userData.profileImage, name:user.username });
        }

        // encrypt userID
        const sub = symmetricCryption.encryption(user.id.toString(), process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        // Create Access Tonken
        const tokens = this.tokenService.generateAccessAndRefreshToken({
            sub: sub,
        });

        // return
        return {
            tokenType: 'Bearer',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            message: PublicMessage.LoginSucces,
        };
    }
}
