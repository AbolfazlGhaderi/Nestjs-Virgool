import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { OtpModule } from '../otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { FollowEntity } from '../../app/models/follow.model';
import { ProfileEntity, UserEntity } from '../../app/models';



@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity, ProfileEntity, FollowEntity ]), OtpModule, TokenModule  ],
    controllers: [ UserController ],
    providers: [ UserService, JwtService ],
    exports: [ UserService, TypeOrmModule, JwtService ],
})
export class UserModule {}
