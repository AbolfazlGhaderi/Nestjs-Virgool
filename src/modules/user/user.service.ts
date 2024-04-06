import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { AuthMessage } from 'src/common/enums';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
}
