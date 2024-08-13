import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailService } from '../mail/mail.service';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from '../../common/services/sms.service';

@Module({
    imports: [ CacheModule.register({ ttl: 120_000 }) ],
    controllers: [],
    providers: [ OtpService, MailService, SmsService ],
    exports:[ OtpService, CacheModule ],
})
export class OtpModule {}
