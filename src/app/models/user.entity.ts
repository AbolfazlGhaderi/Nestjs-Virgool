import { EntityEnum } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
