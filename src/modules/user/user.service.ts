import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { ProfileDto } from './dto/profile.dto';
import { OtpService } from '../otp/otp.service';
import { ProfileImage } from 'src/common/types';
import { isDate, Length } from 'class-validator';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderEnum } from 'src/common/enums/profile';
import { TokenService } from '../token/token.service';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { ProfileEntity, UserEntity } from 'src/app/models';
import { ChangeUserNameDTO } from './dto/change.username.dto';
import { AuthMessage, CookieKeys, PublicMessage, TokenType } from 'src/common/enums';
import { ConflictMessages, NotFoundMessages } from 'src/common/enums/message.enum';
import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
   constructor(
      private tokenService: TokenService,
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(ProfileEntity)
      private readonly profileRepository: Repository<ProfileEntity>,
      private readonly otpService: OtpService,
      @Inject(REQUEST) private readonly request: Request
   ) {}

   // find user By Phone Number
   async findUserByPhone(phone: string) {
      const user = await this.userRepository.findOne({
         where: { phone: phone },
         relations: { profile: true }
      });
      // if (!user) {
      //   throw new NotFoundException(AuthMessage.notFoundAccount);
      // }
      return user;
   }

   // find user By Email
   async findUserByEmail(email: string) {
      const user = await this.userRepository.findOne({
         where: { email: email },
         relations: { profile: true }
      });
      // if (!user) {
      //     throw new NotFoundException(AuthMessage.notFoundAccount);
      // }
      return user;
   }

   // find user By User Name
   async findUserByUserName(userName: string) {
      const user = await this.userRepository.findOne({
         where: { username: userName },
         relations: { profile: true }
      });
      // if (!user) {
      //     throw new NotFoundException(AuthMessage.notFoundAccount);
      // }
      return user;
   }

   // find user By User Name
   async findUserByUserId(id: string) {
      const user = await this.userRepository.findOne({
         where: { id: id },
         relations: { profile: true }
      });
      // if (!user) {
      //     throw new NotFoundException(AuthMessage.notFoundAccount);
      // }
      return user;
   }

   async UpdateProfileS(files: ProfileImage, profileData: ProfileDto) {
      const { id } = this.request.user as UserEntity;

      // Get images from Multer

      if (files.bg_image) {
         let bgImage = files.bg_image[0];
         if (bgImage.path) {
            profileData.bg_image = bgImage.path.slice(7);
         }
      }

      if (files.image_profile) {
         let imageProfile = files.image_profile[0];
         if (imageProfile.path) {
            profileData.image_profile = imageProfile.path.slice(7);
         }
      }

      // search profile
      let profilee = await this.profileRepository.findOne({
         where: {
            user: {
               id: id
            }
         }
      });

      // get data from Profile Data
      const { bio, birth_day, gender, linkedin_profile, nick_name, x_profile, bg_image, image_profile } = profileData;

      if (profilee) {
         if (bio) profilee.bio = bio;
         if (birth_day && isDate(new Date(birth_day))) profilee.birth_day = new Date(birth_day);
         if (gender && Object.values(GenderEnum as any).includes(gender)) profilee.gender = gender;
         if (linkedin_profile) profilee.linkedin_profile = linkedin_profile;
         if (nick_name) profilee.nick_name = nick_name;
         if (x_profile) profilee.x_profile = x_profile;
         if (image_profile) profilee.image_profile = image_profile;
         if (bg_image) profilee.bg_image = bg_image;
      } else {
         profilee = this.profileRepository.create({
            bio,
            birth_day,
            gender,
            linkedin_profile,
            nick_name,
            x_profile,
            bg_image,
            image_profile,
            user: { id: id }
         });
      }
      if (profilee.nick_name === null || profilee.nick_name === undefined) {
         profilee.nick_name = 'UNKNOWN';
      }

      // save profile
      profilee = await this.profileRepository.save(profilee);

      return {
         message: PublicMessage.updateSuccess,
         data: profilee
      };
   }

   async GetProfileS() {
      const { id } = this.request.user as UserEntity;

      const user = await this.userRepository.findOne({
         where: { id },
         relations: ['profile']
      });
      if (!user) throw new HttpException(NotFoundMessages.userNotFound, HttpStatus.NOT_FOUND);

      return user;
   }

   async ChangeEmailS(data: ChangeEmailDTO) {
      const { id, email } = this.request.user as UserEntity;
      let newEmail = data.email;

      newEmail = newEmail.trim().toLowerCase();

      if (email === newEmail) {
         return {
            message: PublicMessage.emailUpdated
         };
      }
      const user = await this.findUserByEmail(newEmail);
      if (user) throw new HttpException(ConflictMessages.emailConflict, HttpStatus.CONFLICT);

      // send and save Otp Code

      const code = await this.otpService.sendAndSaveEmailOTP(email);
      const token = this.tokenService.createChanegToken({ sub: newEmail });

      return {
         code,
         token,
         message: PublicMessage.sendEmailSuccess
      };
   }

   async checkOtpS(data: CheckOtpDto) {
      const token = this.request.cookies?.[CookieKeys.ChangeOTP];
      if (!token) throw new HttpException(AuthMessage.expiredOtp, HttpStatus.FORBIDDEN);

      // if (!this.request.user?.email || !this.request.user.id) {
      //    throw new UnauthorizedException('');
      // }
      const { id, email } = this.request.user as UserEntity;
      const { code } = data;
      const payload = this.tokenService.verifyOtpToken(token, TokenType.ChangeOtp);
      const newEmail = payload.sub;

      const savedCode = await this.otpService.checkOtp(`${email}:Change-otp`, TokenType.ChangeOtp);
      if (savedCode !== code) {
         throw new HttpException(AuthMessage.otpCodeIncorrect, HttpStatus.FORBIDDEN);
      }

      await this.otpService.deleteByKey(`${email}:Change-otp`);

      // update email
      try {
         await this.userRepository.update(id, { email: newEmail });
      } catch (err) {
         throw new HttpException(PublicMessage.Error, HttpStatus.BAD_REQUEST);
      }
      return {
         message: PublicMessage.emailUpdated
      };
   }

   async changeUserNameS(data: ChangeUserNameDTO) {
      const { id } = this.request.user as UserEntity;
      let { username } = data;
      username = username.trim().toLowerCase();
      const user = await this.findUserByUserName(username);
      if (user) throw new HttpException(ConflictMessages.userConflict, HttpStatus.CONFLICT);
      await this.userRepository.update({ id }, { username });

      return {
         message: PublicMessage.updateSuccess
      };
   }
}
