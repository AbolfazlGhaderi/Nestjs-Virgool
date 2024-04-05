import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { UserService } from 'src/user/user.service';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService,UserService],
})
export class AuthModule {}
