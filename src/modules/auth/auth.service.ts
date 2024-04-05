import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthMessage, AuthMethods, AuthType, BadRequestMesage } from 'src/common/enums';
import { UsernameValidator } from 'src/app/utils/username.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService : UserService,
  ) {}
  async userExistenceS(authData: AuthDto) {
    const { method, type, username } = authData;

    switch (type) {
      // Login
      case AuthType.Login:
        return this.login(method, username);

      // Register
      case AuthType.Register:
        return this.register(method, username);

      default:
        throw new UnauthorizedException();
    }
  }

  async login(method: AuthMethods, username: string) {
    const validUserName = UsernameValidator(username, method);
    let user: UserEntity;

    switch (method) {
      case AuthMethods.Email:
        user = await this.userService.findUserByEmail(validUserName)
        break;
      case AuthMethods.Phone:
        user = await this.userService.findUserByPhone(validUserName)
        break;
      case AuthMethods.Username:
        user = await this.userService.findUserByUserName(validUserName)

        break;
      default:
        throw new BadRequestException(BadRequestMesage.inValidData);
    }


    return user
  }
  register(method: AuthMethods, username: string) {
    const validUserName = UsernameValidator(username, method);
  }


}
