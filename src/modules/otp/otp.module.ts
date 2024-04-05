import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';

@Module({
  imports: [CacheModule.register({ ttl: 60000 })],
  controllers: [],
  providers: [OtpService],
  exports:[OtpService,CacheModule]
})
export class OtpModule {}