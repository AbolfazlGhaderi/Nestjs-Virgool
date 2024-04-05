import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [AuthModule],
})
export class AppModule {}
