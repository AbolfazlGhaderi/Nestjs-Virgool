import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity, UserEntity } from 'src/app/models';
import { AuthMessage, PublicMessage } from 'src/common/enums';
import { Repository } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate, Length } from 'class-validator';
import { GenderEnum } from 'src/common/enums/profile';
import { ProfileImage } from 'src/common/types';
import { profile } from 'console';
import { ConflictMessages, NotFoundMessages } from 'src/common/enums/message.enum';
import { ChangeEmailDTO } from './dto/change.email.dto';
import { OtpService } from '../otp/otp.service';
import { TokenService } from '../token/token.service';
import { CheckOtpDto } from '../auth/dto/otp.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
   constructor(
       private  tokenServce: TokenService,
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(ProfileEntity)
      private readonly profileRepository: Repository<ProfileEntity>,
      private readonly otpService : OtpService,
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
   async findUserByUserId(ID: string) {
      const user = await this.userRepository.findOne({
         where: { id: +ID },
         relations: { profile: true }
      });
      // if (!user) {
      //     throw new NotFoundException(AuthMessage.notFoundAccount);
      // }
      return user;
   }

   async UpdateProfileS(files: ProfileImage, profileData: ProfileDto) {
      const { id } = this.request.user;

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
      const { id } = this.request.user;

      const user = await this.userRepository.findOne({
         where: { id },
         relations: ['profile']
      });
      if (!user) throw new NotFoundException(NotFoundMessages.userNotFound);

      return user;
   }

   async ChangeEmailS(data: ChangeEmailDTO) {

      const { id , email} = this.request.user;
      const newEmail = data.email


      if(email === newEmail){
         return {
            message: PublicMessage.emailUpdated
         }
      }
      const user = await this.findUserByEmail(newEmail);
      if (user) throw new ConflictException(ConflictMessages.emailConflict);

      // send and save Otp Code
      
      const code = await this.otpService.sendAndSaveEmailOTP(email)     
      const token = this.tokenServce.createTokenChangeEmail({sub:email , sub2:newEmail})
      
      return {
         code,
         token ,
         message: PublicMessage.sendEmailSuccess
      }

   }

   async checkOtpS(code : CheckOtpDto){
      console.log(code);
      return "check otp change"
   }
}
