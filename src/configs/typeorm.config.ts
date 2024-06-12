import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfig(): TypeOrmModuleOptions {
  // variables...
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

  return {
    type: 'postgres',
    port: DB_PORT,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    username: DB_USERNAME,
    autoLoadEntities:false,
    entities: ['dist/**/**.model{.ts,.js}'],
    synchronize:true
  };
}
