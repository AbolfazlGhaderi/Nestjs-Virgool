import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpModule } from '../otp/otp.module';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { GoogleOauthController } from './google.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserModule } from '../../modules/user/user.module';
import { UserService } from '../../modules/user/user.service';
import { SmsService } from '../../common/services/sms.service';

@Module({
    imports: [ UserModule, OtpModule, TokenModule ],
    controllers: [ AuthController, GoogleOauthController ],
    providers: [ AuthService, UserService, SmsService, GoogleStrategy ],
    exports: [ AuthService, TokenModule ],
})
export class AuthModule {}
