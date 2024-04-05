import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports:[UserModule,OtpModule],
  controllers: [AuthController],
  providers: [AuthService,UserService],

})
export class AuthModule {}
