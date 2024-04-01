import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    async userExistenceS(auhtData : AuthDto){

        return 'hello'
    }
}
