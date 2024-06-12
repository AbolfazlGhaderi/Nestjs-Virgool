import { modelEnum } from 'src/common/enums';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.model';

@Entity({ name: modelEnum.Profile })
export class ProfileEntity {
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
   birth_day: Date;
   @Column({ nullable: true, default: null })
   x_profile: string;
   @Column({ nullable: true, default: null })
   linkedin_profile: string;

   @OneToOne(() => UserEntity, (user) => user.profile, { nullable: false })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
}
