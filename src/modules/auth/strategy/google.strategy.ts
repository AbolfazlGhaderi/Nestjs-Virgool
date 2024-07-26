import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { IsEmail } from 'class-validator';

interface ProfileGoogle {
    name: { familyName: string; givenName: string } | undefined;
    emails: { value: string; verified: boolean }[] | undefined;
    photos: { value: string }[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor()
    {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope:[ 'email', 'profile' ],
        });

    }

    validate(accesToken:string, refreshToken:string, profile:ProfileGoogle, done:VerifyCallback)
    {
        const { emails, photos, name } = profile;
        const [ emailData ] = emails || [];
        const [ photoData ] = photos || [];

        const user = {
            email : emailData.value || undefined,
            profile_image: photoData?.value || undefined,
            firstName: name?.givenName,
            lastName: name?.familyName,
            accesToken,
        };

        done(null, user);
    }
}

