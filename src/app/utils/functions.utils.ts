import { randomBytes } from "node:crypto";


export const createSlug = (str: string) => {
    return str.replace(/[،ًًًٌٍُِ\.\+\-_)(*&^%$#@!~'";:?><«»`ء]+/g, '')?.replace(/[\s]+/g, '-');
}


export function ceateRandomByte(size:number){

    return randomBytes(size).toString('hex')

}