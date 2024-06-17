import { UserEntity } from './user.model';
import { modelEnum } from 'src/common/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity(modelEnum.Image)
export class ImageEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @Column({ nullable: false, unique: true })
   name: string;
   @Column({ nullable: false })
   location: string;
   @Column({ nullable: false })
   alt: string;
   @Column({ nullable: true, unique: true })
   hash?: string;
   @ManyToOne(() => UserEntity, (user) => user.image, { nullable: false })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
   @CreateDateColumn()
   create_at: Date;
}
