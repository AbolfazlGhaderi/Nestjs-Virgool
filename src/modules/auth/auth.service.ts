import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import {
  AuthMessage,
  AuthMethods,
  AuthType,
  BadRequestMesage,
} from 'src/common/enums';
import { UsernameValidator } from 'src/app/utils/username.validator';
import { UserEntity } from 'src/app/models';
import { UserService } from 'src/modules/user/user.service';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  async userExistenceS(authData: AuthDto) {
    const { method, type, username } = authData;
    const validUserName = UsernameValidator(username, method);

    switch (type) {
      // Login
      case AuthType.Login:
        return this.login(method, validUserName);

      // Register
      case AuthType.Register:
        return this.register(method, validUserName);

      default:
        throw new UnauthorizedException(BadRequestMesage.inValidData);
    }
  }

  // Login
  async login(method: AuthMethods, username: string) {
    // check Exist User
    const user: UserEntity = await this.checkExistUser(method, username);
    if (!user) throw new NotFoundException(AuthMessage.notFoundAccount);

    if (method === AuthMethods.Email) {
      const otp = await this.otpService.generateAndSaveOTP(user.email);
      return {
        otp:otp,
        method:method,
        username:username
      }

    } else if (method === AuthMethods.Phone) {
      const otp = await this.otpService.generateAndSaveOTP(user.phone);
      return {
        otp:otp,
        method:method,
        username:username
      }

    } else {
    }
  }

  // Register
  async register(method: AuthMethods, username: string) {
    const user: UserEntity = await this.checkExistUser(method, username);
  }

  //check Exist User
  async checkExistUser(method: string, username: string) {
    let user: UserEntity;

    switch (method) {
      case AuthMethods.Email:
        user = await this.userService.findUserByEmail(username);
        break;
      case AuthMethods.Phone:
        user = await this.userService.findUserByPhone(username);
        break;
      case AuthMethods.Username:
        user = await this.userService.findUserByUserName(username);

        break;
      default:
        throw new BadRequestException(BadRequestMesage.inValidData);
    }
    return user;
  }
}
