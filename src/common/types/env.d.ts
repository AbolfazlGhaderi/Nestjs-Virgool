namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    ACCESS_TOKEN_SECRET: string; 
    OTP_TOKEN_SECRET: string;
    COOKIE_SECRET: string;
    ENCRYPT_SECRET: string;
    ENCRYPT_IV: string;
  }
}
