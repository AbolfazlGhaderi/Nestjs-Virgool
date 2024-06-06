import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';
import { OtpModule } from '../otp/otp.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
   imports: [ UserModule,OtpModule ,TokenModule ],
   controllers: [AuthController],
   providers: [AuthService, UserService ],
   exports: [AuthService,TokenModule]
})
export class AuthModule {}
