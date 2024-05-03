import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserModule } from 'src/modules/user/user.module';
import { OtpModule } from '../otp/otp.module';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';

@Module({
   imports: [ UserModule,OtpModule ,TokenModule ],
   controllers: [AuthController],
   providers: [AuthService, UserService ]
})
export class AuthModule {}
