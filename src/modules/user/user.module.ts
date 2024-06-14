import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { OtpModule } from '../otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { TokenModule } from '../token/token.module';
import { ProfileEntity, UserEntity } from 'src/app/models';



@Module({
   imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), OtpModule ,TokenModule  ],
   controllers: [UserController ],
   providers: [UserService , JwtService ],
   exports: [UserService, TypeOrmModule ,JwtService ]
})
export class UserModule {}
