import * as Crypto from 'node:crypto';
import { promises as fs } from 'node:fs';

export abstract class HashingUtils {
   static async hashFile(path: string) {
      const hash = Crypto.createHash('sha256');
      // check file
      try {
         const fileBuffer = await fs.readFile(path+"ll");
         hash.update(fileBuffer);
         return hash.digest('hex');
      } catch (error) {
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return false;
         }
         return error;
      }
   }
}
