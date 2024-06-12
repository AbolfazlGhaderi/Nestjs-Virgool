import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity, UserEntity } from 'src/app/models';
import { TokenService } from '../token/token.service';
import { OtpModule } from '../otp/otp.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';



@Module({
   imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), OtpModule ,TokenModule  ],
   controllers: [UserController ],
   providers: [UserService , JwtService ],
   exports: [UserService, TypeOrmModule ,JwtService ]
})
export class UserModule {}
