import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../app/models';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthMessage, TokenType } from '../../common/enums';
import { symmetricCryption } from '../../app/utils/encrypt.decrypt';
import {  HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccessTokenPayload, OtpCookiePayload } from '../../common/types/auth/payload.type';

@Injectable()
export class TokenService
{
    constructor(
      private readonly jwtService: JwtService,
      // private readonly userService: UserService
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
    ) {}

    // -------------------- OTP Token -------------------------------- ===>
    createOtpToken(payload: OtpCookiePayload)
    {
        const token = this.jwtService.sign(payload, {
            secret: process.env.OTP_TOKEN_SECRET,
            expiresIn: '2m',
        });

        return token;
    }

    createChanegToken(payload: OtpCookiePayload)
    {
        return this.jwtService.sign(payload, {
            secret: process.env.CHANGE_TOKEN_SECRET,
            expiresIn: '2m',
        });
    }
    // -------------------- Access Token ----------------------------- ===>

    generateAccessAndRefreshToken(payload: AccessTokenPayload)
    {
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '1h',
        });

        const refreshToken =  this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '3d',
        });

        return {
            accessToken : { token : accessToken, expire : Date.now() + 1000 * 60 * 60 },
            refreshToken : { token : refreshToken, expire : Date.now() + 1000 * 60 * 60 * 24 * 3 },
        };
    }

    // ------------------ Verify ------------------------------------- ===>
    async validateAccessToken(token: string)
    {
        const { sub } = this.verifyAccessToken(token);

        // userId decrypted
        const userId = symmetricCryption.decrypted(sub, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        // check exist user
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);

        return user;
    }

    verifyAccessToken(token: string): AccessTokenPayload
    {
        try
        {
            return this.jwtService.verify(token, {
                secret: process.env.ACCESS_TOKEN_SECRET,
            });
        }
        catch
        {
            throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
        }
    }

    verifyOtpToken(token: string, type: string): { sub: string }
    {
        try
        {
            if (type === TokenType.Login)
            {
                return this.jwtService.verify(token, {
                    secret: process.env.OTP_TOKEN_SECRET,
                });
            }
            else if (type === TokenType.ChangeOtp)
            {
                return this.jwtService.verify(token, {
                    secret: process.env.CHANGE_TOKEN_SECRET,
                });
            }
        }
        catch
        {
            if (type === TokenType.Login)
            {
                throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
            }
            else if (type === TokenType.ChangeOtp)
            {
                throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);
            }
        }
        return { sub: '' };
    }
}
