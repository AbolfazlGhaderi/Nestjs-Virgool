import * as crypto from 'crypto';

export const symmetricCryption = {

    encryption(data: string, key: string, iv: string)
    {

        // convert to Buffer
        const keyBuffer = Buffer.from(key, 'base64');

        const ivBuffer = Buffer.from(iv, 'base64');

        // encrypt
        const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);

        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return encrypted;

    },

    decrypted(data: string, key: string, iv: string)
    {
    // convert to Buffer
        const keyBuffer = Buffer.from(key, 'base64');

        const ivBuffer = Buffer.from(iv, 'base64');

        // decrypt
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            keyBuffer,
            ivBuffer,
        );

        let decrypted = decipher.update(data, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        // return decrypted
        return decrypted;
    },

};

// }

// export default symmetricCryption;
