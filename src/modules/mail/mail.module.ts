import { Global, Inject, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
    imports: [ MailerModule.forRootAsync({
        useFactory:() => ({
            transport:{
                host: process.env.EMAIL_HOST,
                port: +process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            },

        }),
    }) ],
    controllers: [],
    providers: [ MailService ],
    exports: [ MailService ],
})
export class MailModule
{}