import {  Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity, UserEntity } from 'src/app/models';
import { TokenService } from '../auth/token.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,ProfileEntity])],
  controllers: [UserController],
  providers: [UserService,TokenService,JwtService],
  exports:[UserService,TypeOrmModule]
})
export class UserModule {}
