import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProfileEntity, UserEntity } from '../../app/models'
import { FollowEntity } from '../../app/models/follow.model'
import { OtpModule } from '../otp/otp.module'
import { UserService } from '../user/user.service'
import { TokenService } from './token.service'


@Module({
    imports: [ TypeOrmModule.forFeature([ UserEntity, ProfileEntity, FollowEntity ]), OtpModule ],
    controllers: [],
    providers: [ UserService, TokenService, JwtService ],
    exports:[ TokenService, JwtService  ],
})
export class TokenModule {}
