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

        return {
            token : token,
            expire : Date.now() + 1000 * 60 * 2, // 2 minutes
        };
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
            tokenType : 'Bearer',
            accessToken : { token : accessToken, expire : Date.now() + 1000 * 60 * 60 }, // 1 hour
            refreshToken : { token : refreshToken, expire : Date.now() + 1000 * 60 * 60 * 24 * 3 }, // 3 day
        };
    }

    // ------------------ Verify ------------------------------------- ===>
    async validateAccessToken(token: string)
    {
        const { sub } = this.verifyToken(token, 'access');

        // userId decrypted
        const userId = symmetricCryption.decrypted(sub, process.env.ENCRYPT_SECRET, process.env.ENCRYPT_IV);

        // check exist user
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
        return user;
    }
    validateRefreshoken(token: string)
    {
        const { sub } =  this.verifyToken(token, 'refresh');
        return this.generateAccessAndRefreshToken({ sub: sub });
    }

    verifyToken(token: string, type: 'access' | 'refresh'): AccessTokenPayload
    {
        try
        {
            if (type === 'access')
            {
                return this.jwtService.verify(token, {
                    secret: process.env.ACCESS_TOKEN_SECRET,
                    ignoreExpiration: false,
                });
            }
            else if (type === 'refresh')
            {
                return this.jwtService.verify(token, {
                    secret: process.env.REFRESH_TOKEN_SECRET,
                    ignoreExpiration: false,
                });
            }
            else throw new Error('Invalid token type => access / refresh');

        }
        catch
        {
            throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
        }
    }

    verifyOtpToken(token: string, type?: string ):{sub:string}
    {
        try
        {
            return this.jwtService.verify(token, {
                secret: process.env.OTP_TOKEN_SECRET,
            });

        }
        catch
        {
            if (type === TokenType.Login)
            {
                throw new HttpException(AuthMessage.LoginAgain, HttpStatus.UNAUTHORIZED);
            }
            else
            {
                throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);
            }
        }

    }

}
