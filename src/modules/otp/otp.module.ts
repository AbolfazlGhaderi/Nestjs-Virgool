import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [CacheModule.register({ ttl: 120000 })],
  controllers: [],
  providers: [OtpService],
  exports:[OtpService,CacheModule]
})
export class OtpModule {}
