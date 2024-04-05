import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/app/models';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}

    async findUserByPhone(phone:string){
        const user = await this.userRepository.findOne({where:{phone:phone},relations:{profile:true}})
        if(!user){
            throw new NotFoundException('user not found')
        }
        return user
    }
}
