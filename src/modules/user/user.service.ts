import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProfileDto } from './dto/profile.dto';
import { OtpService } from '../otp/otp.service';
import { PaginationDto } from '../../common/dtos';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from '../token/token.service';
import { GenderEnum } from '../../common/enums/profile';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { OtpKey } from '../../common/enums/otp.keys.enum';
import { FollowEntity } from '../../app/models/follow.model';
import { ProfileEntity, UserEntity } from '../../app/models';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { AuthMessage, CookieKeys, PublicMessage, TokenType } from '../../common/enums';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';
import { ConflictMessages, NotFoundMessages, BadRequestMesage } from '../../common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService
{
    constructor(
        private tokenService: TokenService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>,
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

    async UpdateProfileS( profileData: ProfileDto)
    {
        const { id } = this.request.user as UserEntity;

        // Get images from Multer

        // files: ProfileImage = 
        // {
        // bg_image: MulterFile[];
        //  image_profile: MulterFile[];
        // }

        // if (files.bg_image)
        // {
        //     const bgImage = files.bg_image[0];
        //     if (bgImage.path)
        //     {
        //         profileData.bgImage = bgImage.path.slice(7);
        //     }
        // }

        // if (files.image_profile)
        // {
        //     const imageProfile = files.image_profile[0];
        //     if (imageProfile.path)
        //     {
        //         profileData.imageProfile = imageProfile.path.slice(7);
        //     }
        // }

        // search profile
        let userProfile = await this.profileRepository.findOne({
            where: {
                user: {
                    id: id,
                },
            },
        });

        // get data from Profile Data
        const { bio, birthDay, gender, linkedinProfile, nickName, xProfile, bgImage, imageProfile } = profileData;

        if (userProfile)
        {
            if (bio) userProfile.bio = bio;
            userProfile.birth_day = birthDay || userProfile.birth_day;
            if (gender && gender in GenderEnum) userProfile.gender = gender;
            if (linkedinProfile) userProfile.linkedin_profile = linkedinProfile;
            if (nickName) userProfile.nick_name = nickName;
            if (xProfile) userProfile.x_profile = xProfile;
            if (imageProfile) userProfile.image_profile = imageProfile;
            if (bgImage) userProfile.bg_image = bgImage;
        }
        else
        {
            userProfile = this.profileRepository.create({
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
        if (userProfile.nick_name === null || userProfile.nick_name === undefined)
        {
            userProfile.nick_name = 'UNKNOWN';
        }

        // save profile
        userProfile = await this.profileRepository.save(userProfile);

        return {
            message: PublicMessage.UpdateSuccess,
            data: userProfile,
        };
    }

    async GetProfileS()
    {
        const { id } = this.request.user as UserEntity;

        const user = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .leftJoinAndSelect('user.profile', 'profile')
            .loadRelationCountAndMap('user.followers', 'user.followers')
            .loadRelationCountAndMap('user.following', 'user.following')
            .getOne();
        if (!user) throw new HttpException(NotFoundMessages.UserNotFound, HttpStatus.NOT_FOUND);

        return user;
    }

    async CreateProfileFromGoogle(userData:UserEntity, profileData:{ image:string, name:string })
    {
        profileData.name = profileData.name || 'Guast';
        return await this.profileRepository.save({ user:{ id:userData.id }, image_profile:profileData.image, nick_name:profileData.name });

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
        const token = this.tokenService.createOtpToken({ sub: newEmail });

        return {
            code,
            token,
            message: PublicMessage.SendEmailSuccess,
        };
    }

    async CheckOtpS(data: CheckOtpDto)
    {
        const token : string | undefined = this.request.cookies?.[CookieKeys.ChangeEmail];
        if (!token) throw new HttpException(AuthMessage.ExpiredOtp, HttpStatus.FORBIDDEN);

        // if (!this.request.user?.email || !this.request.user.id) {
        //    throw new UnauthorizedException('');
        // }
        const { id, email } = this.request.user as UserEntity;
        const { code } = data;
        const payload = this.tokenService.verifyOtpToken(token, TokenType.Change);
        const newEmail = payload.sub;

        const savedCode = await this.otpService.checkOtp(`${email}${OtpKey.Change}`, TokenType.Change);
        if (savedCode !== code)
        {
            throw new HttpException(AuthMessage.OtpCodeIncorrect, HttpStatus.FORBIDDEN);
        }

        await this.otpService.deleteByKey(`${email}${OtpKey.Change}`);

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

    async ChangeUserNameS(data: ChangeUserNameDTO)
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

    async FollowToggle(followedId:string)
    {
        const user = this.request.user as UserEntity;
        if (followedId === user.id)
        {
            throw new HttpException(BadRequestMesage.FollowYourself, HttpStatus.BAD_REQUEST);
        }
        const followed = await this.findUserByUserId(followedId);
        if (!followed) throw new HttpException(NotFoundMessages.UserNotFound, HttpStatus.NOT_FOUND);

        const isFollow =  await  this.followRepository.findOne({
            where:{ followed:{ id: followedId }, follower:{ id:user.id } },
        });
        if (isFollow)
        {
            await this.followRepository.remove(isFollow);
            return {
                message : PublicMessage.UnFollow,
            };
        }

        await this.followRepository.insert({ follower: user, followed: followed });
        return {
            message: PublicMessage.Follow,
        };
    }

    async GetAllUsers(paginationData:PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        const [ users, count ] = await this.userRepository.findAndCount({ order:{ id:'DESC' }, take:limit, skip });
        if (users.length === 0)
            throw new HttpException(NotFoundMessages.UserNotFound, HttpStatus.NOT_FOUND);

        return {
            pagination : paginationGenerator(count, page, limit),
            users,
        };
    }

    async GetAllFollowers(paginationData:PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        const user = this.request.user as UserEntity;

        const [ followers, count ] = await this.followRepository.findAndCount({
            where:{
                followed:{ id:user.id },
            },
            relations: {
                follower: { profile: true },
            },
            select:{
                id:true,
                follower:{
                    id:true,
                    username:true,
                    profile:{
                        nick_name:true,
                        image_profile:true,
                        bio:true,
                    },
                },
            },
            order:{ id:'DESC' },
            take:limit,
            skip,
        });
        if (followers.length === 0)
            throw new HttpException(NotFoundMessages.FollowerNotFound, HttpStatus.NOT_FOUND);

        return {
            pagination : paginationGenerator(count, page, limit),
            followers,
        };
    }


    async GetAllFollowing(paginationData:PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);
        const user = this.request.user as UserEntity;

        const [ following, count ] = await this.followRepository.findAndCount({
            where:{
                follower:{ id:user.id },
            },
            relations: {
                followed: { profile: true },
            },
            select:{
                id:true,
                followed:{
                    id:true,
                    username:true,
                    profile:{
                        nick_name:true,
                        image_profile:true,
                        bio:true,
                    },
                },
            },
            order:{ id:'DESC' },
            take:limit,
            skip,
        });
        if (following.length === 0) throw new HttpException(NotFoundMessages.FollowerNotFound, HttpStatus.NOT_FOUND);

        return {
            pagination: paginationGenerator(count, page, limit),
            following,
        };
    }
}
