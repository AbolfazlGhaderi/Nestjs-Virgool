import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpModule } from '../otp/otp.module';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { ProfileEntity, UserEntity } from '../../app/models';
import { FollowEntity } from '../../app/models/follow.model';


@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity, ProfileEntity, FollowEntity ]), OtpModule ],
    controllers: [],
    providers: [ UserService, TokenService, JwtService ],
    exports:[ TokenService, JwtService  ],
})
export class TokenModule {}
