import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'

import { SmsService } from '../../common/services/sms.service'
import { MailService } from '../mail/mail.service'
import { OtpService } from './otp.service'

@Module({
    imports: [ CacheModule.register({ ttl: 120_000 }) ],
    controllers: [],
    providers: [ OtpService, MailService, SmsService ],
    exports:[ OtpService, CacheModule ],
})
export class OtpModule {}
