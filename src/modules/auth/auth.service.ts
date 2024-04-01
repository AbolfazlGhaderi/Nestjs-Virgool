import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthMethods, AuthType } from 'src/common/enums';
import { UsernameValidator } from 'src/app/utils/username.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
        user = await this.userRepository.findOneBy({ email: validUserName });
        break;
      case AuthMethods.Phone:
        user = await this.userRepository.findOneBy({ phone: validUserName });
        break;
      case AuthMethods.Username:
        user = await this.userRepository.findOneBy({
          user_name: validUserName,
        });
        break;
      default:
        throw new BadRequestException('method is not valid');
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }
  }
  register(method: AuthMethods, username: string) {
    const validUserName = UsernameValidator(username, method);
  }


}
