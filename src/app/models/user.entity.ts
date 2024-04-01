import { EntityEnum } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity({ name: EntityEnum.User })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: false, unique: true })
  user_name: string;
  @Column({ nullable: true, unique: true })
  phone: string;
  @Column({ nullable: true, unique: true })
  email: string;
  @CreateDateColumn()
  create_at: Date;
  @UpdateDateColumn()
  update_at: Date;
  @DeleteDateColumn({ nullable: true, default: null })
  delete_at: Date;
  
  @OneToOne(() => ProfileEntity)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;
}