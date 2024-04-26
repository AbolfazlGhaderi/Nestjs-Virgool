import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity, UserEntity } from 'src/app/models';
import { AuthMessage, PublicMessage } from 'src/common/enums';
import { Repository } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { isDate } from 'class-validator';
import { GenderEnum } from 'src/common/enums/profile';

@Injectable({scope : Scope.REQUEST})
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private readonly request : Request
  ) {}

  // find user By Phone Number
  async findUserByPhone(phone: string) {
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
  async findUserByEmail(email: string) {
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
  async findUserByUserName(userName: string) {
    const user = await this.userRepository.findOne({
      where: { username: userName },
      relations: { profile: true },
    });
    // if (!user) {
    //     throw new NotFoundException(AuthMessage.notFoundAccount);
    // }
    return user;
  }

  async findUserByUserId(ID: string) {
    const user = await this.userRepository.findOne({
      where: { id: +ID },
      relations: { profile: true },
    });
    // if (!user) {
    //     throw new NotFoundException(AuthMessage.notFoundAccount);
    // }
    return user;
  }

  async UpdateProfileS(file : any , profileData: ProfileDto) {
    const {id,profile} = this.request.user
    // console.log(this.request.user);

    let profilee = await this.profileRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    const {
      bio,
      birth_day,
      gender,
      linkedin_profile,
      nick_name,
      x_profile,
    } = profileData;

    if (profilee) {

      if(bio)  profilee.bio = bio 
      if(birth_day && isDate(new Date(birth_day))) profilee.birth_day = new Date(birth_day)
      if(gender && Object.values(GenderEnum as any).includes(gender)) profilee.gender = gender
      if(linkedin_profile) profilee.linkedin_profile = linkedin_profile
      if(nick_name) profilee.nick_name = nick_name
      if(x_profile) profilee.x_profile = x_profile
    
    } else {
      profilee = this.profileRepository.create({bio,birth_day,gender,linkedin_profile,nick_name,x_profile,user:{id:id}});
    }

    profilee = await this.profileRepository.save(profilee)

    
    return {
      message : PublicMessage.updateSuccess,
      data : profilee
    }
  }
}
