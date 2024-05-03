import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { ProfileEntity, UserEntity } from "src/app/models";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpModule } from "../otp/otp.module";


@Module({
   imports: [ TypeOrmModule.forFeature([UserEntity,ProfileEntity]),OtpModule ],
   controllers: [],
   providers: [UserService,TokenService , JwtService],
   exports:[TokenService , JwtService  ]
})
export class TokenModule {}
