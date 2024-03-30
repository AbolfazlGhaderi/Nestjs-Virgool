import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
