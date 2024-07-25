import { ModelEnum } from '../../common/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.model';

@Entity({ name: ModelEnum.Profile })
export class ProfileEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ nullable: false })
    nick_name: string;
    @Column({ nullable: true, default: null })
    image_profile: string;
    @Column({ nullable: true, default: null })
    bg_image: string;
    @Column({ nullable: true, default: null })
    bio: string;
    @Column({ nullable: true, default: null })
    gender: string;
    @Column({ nullable: true, default: null })
    birth_day: string;
    @Column({ nullable: true, default: null })
    x_profile: string;
    @Column({ nullable: true, default: null })
    linkedin_profile: string;
    @CreateDateColumn()
    create_at: Date;
    @UpdateDateColumn()
    update_at:Date;
    @OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
}
