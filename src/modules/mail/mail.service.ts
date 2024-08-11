import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService
{
    constructor(private mailerService:MailerService)
    {}

    // TODO: from => import from env
    async SendEmail(from:string = 'Ghaderi Abolfazl <dev.ghaderi@gmail.com>', to:string, subject:string, text:string, html:string)
    {
        try
        {
            await this.mailerService.sendMail(
                {
                    from,
                    to,
                    subject,
                    text,
                    html,
                });
            return true;
        }
        catch (error)
        {
            console.log(error);
            return false;
        }
    }
}