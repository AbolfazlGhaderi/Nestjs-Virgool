import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProfileDto } from './dto/profile.dto';
import { OtpService } from '../otp/otp.service';
import { ProfileImage } from '../../common/types';
import { isDate, Length } from 'class-validator';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum } from '../../common/enums/profile';
import { TokenService } from '../token/token.service';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { ProfileEntity, UserEntity } from '../../app/models';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { AuthMessage, CookieKeys, PublicMessage, TokenType } from '../../common/enums';
import { ConflictMessages, NotFoundMessages } from '../../common/enums/message.enum';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserService
{
    constructor(
        private tokenService: TokenService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,
        private readonly otpService: OtpService,
        @Inject(REQUEST) private readonly request: Request,
    ) {}

    // find user By Phone Number
    async findUserByPhone(phone: string)
    {
        const user = await this.userRepository.findOne({
            where: { phone: phone },
            relations: { profile: true },
        });
        // if (!user) {
        //   throw new NotFoundException(AuthMessage.notFoundAccount);
        // }
        return user;
    }

    // find user By Email
    async findUserByEmail(email: string)
    {
        const user = await this.userRepository.findOne({
            where: { email: email },
            relations: { profile: true },
        });
        // if (!user) {
        //     throw new NotFoundException(AuthMessage.notFoundAccount);
        // }
        return user;
    }

    // find user By User Name
    async findUserByUserName(userName: string)
    {
        const user = await this.userRepository.findOne({
            where: { username: userName },
            relations: { profile: true },
        });
        // if (!user) {
        //     throw new NotFoundException(AuthMessage.notFoundAccount);
        // }
        return user;
    }

    // find user By User Name
    async findUserByUserId(id: string)
    {
        const user = await this.userRepository.findOne({
            where: { id: id },
            relations: { profile: true },
        });
        // if (!user) {
        //     throw new NotFoundException(AuthMessage.notFoundAccount);
        // }
        return user;
    }

    async UpdateProfileS(files: ProfileImage, profileData: ProfileDto)
    {
        const { id } = this.request.user as UserEntity;

        // Get images from Multer

        if (files.bg_image)
        {
            const bgImage = files.bg_image[0];
            if (bgImage.path)
            {
                profileData.bgImage = bgImage.path.slice(7);
            }
        }

        if (files.image_profile)
        {
            const imageProfile = files.image_profile[0];
            if (imageProfile.path)
            {
                profileData.imageProfile = imageProfile.path.slice(7);
            }
        }

        // search profile
        let profilee = await this.profileRepository.findOne({
            where: {
                user: {
                    id: id,
                },
            },
        });

        // get data from Profile Data
        const { bio, birthDay, gender, linkedinProfile, nickName, xProfile, bgImage, imageProfile } = profileData;

        if (profilee)
        {
            if (bio) profilee.bio = bio;
            if (birthDay && isDate(new Date(birthDay))) profilee.birth_day = new Date(birthDay);
            if (gender && gender in GenderEnum) profilee.gender = gender;
            if (linkedinProfile) profilee.linkedin_profile = linkedinProfile;
            if (nickName) profilee.nick_name = nickName;
            if (xProfile) profilee.x_profile = xProfile;
            if (imageProfile) profilee.image_profile = imageProfile;
            if (bgImage) profilee.bg_image = bgImage;
        }
        else
        {
            profilee = this.profileRepository.create({
                bio,
                birth_day: birthDay,
                gender,
                linkedin_profile: linkedinProfile,
                nick_name: nickName,
                x_profile: xProfile,
                bg_image: bgImage,
                image_profile: imageProfile,
                user: { id: id },
            });
        }
        if (profilee.nick_name === null || profilee.nick_name === undefined)
        {
            profilee.nick_name = 'UNKNOWN';
        }

        // save profile
        profilee = await this.profileRepository.save(profilee);

        return {
            message: PublicMessage.UpdateSuccess,
            data: profilee,
        };
    }

    async GetProfileS()
    {
        const { id } = this.request.user as UserEntity;

        const user = await this.userRepository.findOne({
            where: { id },
            relations: [ 'profile' ],
        });
        if (!user) throw new HttpException(NotFoundMessages.UserNotFound, HttpStatus.NOT_FOUND);

        return user;
    }

    async ChangeEmailS(data: ChangeEmailDTO)
    {
        const { id, email } = this.request.user as UserEntity;
        let newEmail = data.email;

        newEmail = newEmail.trim().toLowerCase();

        if (email === newEmail)
        {
            return {
                message: PublicMessage.EmailUpdated,
            };
        }
        const user = await this.findUserByEmail(newEmail);
        if (user) throw new HttpException(ConflictMessages.EmailConflict, HttpStatus.CONFLICT);

        // send and save Otp Code

        const code = await this.otpService.sendAndSaveEmailOTP(email);
        const token = this.tokenService.createChanegToken({ sub: newEmail });

        return {
            code,
            token,
            message: PublicMessage.SendEmailSuccess,
        };
    }

    async checkOtpS(data: CheckOtpDto)
    {
        const token : string | undefined = this.request.cookies?.[CookieKeys.ChangeOTP];
        if (!token) throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);

        // if (!this.request.user?.email || !this.request.user.id) {
        //    throw new UnauthorizedException('');
        // }
        const { id, email } = this.request.user as UserEntity;
        const { code } = data;
        const payload = this.tokenService.verifyOtpToken(token, TokenType.ChangeOtp);
        const newEmail = payload.sub;

        const savedCode = await this.otpService.checkOtp(`${email}:Change-otp`, TokenType.ChangeOtp);
        if (savedCode !== code)
        {
            throw new HttpException(AuthMessage.OtpCodeIncorrect, HttpStatus.FORBIDDEN);
        }

        await this.otpService.deleteByKey(`${email}:Change-otp`);

        // update email
        try
        {
            await this.userRepository.update(id, { email: newEmail });
        }
        catch
        {
            throw new HttpException(PublicMessage.Error, HttpStatus.BAD_REQUEST);
        }
        return {
            message: PublicMessage.EmailUpdated,
        };
    }

    async changeUserNameS(data: ChangeUserNameDTO)
    {
        const { id } = this.request.user as UserEntity;
        let { username } = data;
        username = username.trim().toLowerCase();
        const user = await this.findUserByUserName(username);
        if (user) throw new HttpException(ConflictMessages.UserConflict, HttpStatus.CONFLICT);
        await this.userRepository.update({ id }, { username });

        return {
            message: PublicMessage.UpdateSuccess,
        };
    }
}
