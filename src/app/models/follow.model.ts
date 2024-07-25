import { UserEntity } from './user.model';
import { ModelEnum } from '../../common/enums';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: ModelEnum.Follow })
export class FollowEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ManyToOne(() => UserEntity, (user) => user.following, { nullable: false, onDelete:'CASCADE' })
    @JoinColumn({ name: 'following_id' })
    following: UserEntity;
    @ManyToOne(() => UserEntity, (user) => user.follower, { nullable: false, onDelete:'CASCADE' })
    @JoinColumn({ name: 'follower_id' })
    follower: UserEntity;
    @CreateDateColumn()
    create_at: Date;
}
