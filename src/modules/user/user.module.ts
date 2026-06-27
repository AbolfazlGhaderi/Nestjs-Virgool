import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProfileEntity, UserEntity } from '../../app/models'
import { FollowEntity } from '../../app/models/follow.model'
import { OtpModule } from '../otp/otp.module'
import { TokenModule } from '../token/token.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'



@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity, ProfileEntity, FollowEntity ]), OtpModule, TokenModule  ],
    controllers: [ UserController ],
    providers: [ UserService, JwtService ],
    exports: [ UserService, TypeOrmModule, JwtService ],
})
export class UserModule {}
