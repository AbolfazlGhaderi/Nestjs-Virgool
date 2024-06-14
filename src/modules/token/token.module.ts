import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OtpModule } from "../otp/otp.module";
import { TokenService } from "./token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "../user/user.service";
import { ProfileEntity, UserEntity } from "src/app/models";


@Module({
   imports: [ TypeOrmModule.forFeature([UserEntity,ProfileEntity]),OtpModule ],
   controllers: [],
   providers: [UserService,TokenService , JwtService],
   exports:[TokenService , JwtService  ]
})
export class TokenModule {}
