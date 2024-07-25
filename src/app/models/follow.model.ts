import { UserEntity } from './user.model';
import { ModelEnum } from '../../common/enums';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: ModelEnum.Follow })
export class FollowEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => UserEntity, (user) => user.following, { nullable: false, onDelete:'CASCADE' })
    @JoinColumn({ name: 'follower_id' })
    follower: UserEntity;
    @ManyToOne(() => UserEntity, (user) => user.followers, { nullable: false, onDelete:'CASCADE' })
    @JoinColumn({ name: 'followed_id' })
    followed: UserEntity;
    @CreateDateColumn()
    create_at: Date;
}
