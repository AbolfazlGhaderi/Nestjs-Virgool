import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [ MailerModule.forRootAsync({
        useFactory:(config:ConfigService) => ({
            transport:{
                host: config.get<string>('EMAIL_HOST'),
                port: config.get<number>('EMAIL_PORT'),
                auth: {
                    user: config.get<string>('EMAIL_USER'),
                    pass: config.get<string>('EMAIL_PASS'),
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