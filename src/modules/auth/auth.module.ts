import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from '../otp/otp.module';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[UserModule,OtpModule],
  controllers: [AuthController],
  providers: [AuthService,UserService,TokenService,JwtService]

})
export class AuthModule {}
