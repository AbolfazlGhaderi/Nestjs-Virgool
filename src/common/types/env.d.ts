namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        DB_PORT: number;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        DB_HOST: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        CHANGE_TOKEN_SECRET: string;
        OTP_TOKEN_SECRET: string;
        COOKIE_SECRET: string;
        ENCRYPT_SECRET: string;
        ENCRYPT_IV: string;
        LIARA_OBJS_ENDPOINT: string;
        LIARA_BUCKET_OBJS_NAME: string;
        LIARA_SECRET_OBJS_KEY: string;
        LIARA_ACCESS_OBJS_KEY: string;
        OBJS_LOCATION_ENDPOINT: string;
        SMS_ENDPOINT_VERIFY: string;
        SMS_API_KEY: string;
        SMS_TEMPLATEID: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
    }
}
