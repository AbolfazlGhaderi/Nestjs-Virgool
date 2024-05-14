import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityEnum } from 'src/common/enums';

@Entity(EntityEnum.Blog)
export class BlogEntity {
   @PrimaryGeneratedColumn()
   id: number;
   @Column()
   title: string;
   @Column()
   description: string;
   @Column()
   content: string;
   @Column()
   image: string;
   @Column({ enum: BlogStatus, default: BlogStatus.Draft })
   status: string;
   @ManyToOne(() => UserEntity, (user) => user.blog, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'author' })
   author: UserEntity;
   @CreateDateColumn()
   create_at: Date;
   @UpdateDateColumn()
   update_at: Date;
}
