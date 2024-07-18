import { randomBytes } from 'node:crypto';
import { extname } from 'node:path';

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
