import { extname } from 'node:path';
import { randomBytes } from 'node:crypto';
import { OtpKey } from '../../common/enums/otp.keys.enum';
import { CheckOtpMethods } from '../../modules/user/enums/enums';

export const createSlug = (string: string) =>
{
    return string.replaceAll(/[!"#$%&'()*+.:;<>?@^_`~«»،ءًٌٍُِ-]+/g, '')?.replace(/\s+/g, '-');
};

export function GenerateRandomByte(size: number)
{
    return randomBytes(size).toString('hex');
}

export function GenerateImageName(origialName: string, section:string)
{
    const name = origialName.split(extname(origialName))[0];
    const time = Date.now();
    return `${name}_${section}_${GenerateRandomByte(6)}_${time}${extname(origialName)}`;
}

export function GenerateOtpKey(method:CheckOtpMethods, conetnt:string)
{
    switch (method)
    {
        case CheckOtpMethods.Add: {
            return `${conetnt}${OtpKey.Add}`;
        }
        case CheckOtpMethods.Change: {
            return `${conetnt}${OtpKey.Change}`;
        }
        default: {
            return `${conetnt}${OtpKey.Verify}`;
        }
    }

}
export function GenerateOtpSubject(otpKey:OtpKey)
{
    switch (otpKey)
    {
        case OtpKey.Add: {
            return 'Add';
        }
        case OtpKey.Change: {
            return 'Change';
        }
        case OtpKey.Verify: {
            return 'Verify';
        }
        default: {
            return 'Login';
        }
    }

}