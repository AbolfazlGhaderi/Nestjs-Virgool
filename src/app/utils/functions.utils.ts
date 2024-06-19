import { randomBytes } from 'node:crypto';
import { extname } from 'node:path';

export const createSlug = (str: string) => {
   return str.replace(/[،ًًًٌٍُِ\.\+\-_)(*&^%$#@!~'";:?><«»`ء]+/g, '')?.replace(/[\s]+/g, '-');
};

export function GenerateRandomByte(size: number) {
   return randomBytes(size).toString('hex');
}

export function GenerateImageName(origialName: string) {
   let name = origialName.split(extname(origialName))[0];
   const time = Date.now();
   return `${name}_${GenerateRandomByte(6)}_${time}${extname(origialName)}`;
}
