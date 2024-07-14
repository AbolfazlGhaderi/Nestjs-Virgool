import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpModule } from '../otp/otp.module';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../../modules/user/user.module';
import { UserService } from '../../modules/user/user.service';

@Module({
    imports: [ UserModule, OtpModule, TokenModule ],
    controllers: [ AuthController ],
    providers: [ AuthService, UserService ],
    exports: [ AuthService, TokenModule ],
})
export class AuthModule {}
