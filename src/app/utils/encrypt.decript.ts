import * as crypto from 'crypto';

export class symmetricCryption {
    
  static encryption(email: string ,key: string, iv: string) {

    // convert to Buffer
    const keyBuffer = Buffer.from(key, 'base64');

    const ivBuffer = Buffer.from(iv, 'base64');

    // encrypt
    const cipher=crypto.createCipheriv('aes-256-cbc',keyBuffer,ivBuffer)

    let encrypted = cipher.update(email,"utf-8",'base64')
    encrypted += cipher.final('base64');

    return encrypted

  }

  static decrypted(sub: string, key: string, iv: string) {
    // convert to Buffer
    const keyBuffer = Buffer.from(key, 'base64');

    const ivBuffer = Buffer.from(iv, 'base64');

    // decrypt
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      keyBuffer,
      ivBuffer,
    );

    let decrypted = decipher.update(sub, 'base64', 'utf-8');
    decrypted += decipher.final('utf8');

    // return decrypted
    return decrypted;
  }

}

// }

// export default symmetricCryption;
