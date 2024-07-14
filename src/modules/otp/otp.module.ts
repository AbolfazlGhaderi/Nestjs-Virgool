import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [ CacheModule.register({ ttl: 120_000 }) ],
    controllers: [],
    providers: [ OtpService ],
    exports:[ OtpService, CacheModule ],
})
export class OtpModule {}
