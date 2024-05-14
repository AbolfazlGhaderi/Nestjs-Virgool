import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { EntityEnum } from 'src/common/enums';
import { BlogLikesEntity } from './like.model';
import { BlogBookmarkEntity } from './bookmark.model';

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
   @JoinColumn({ name: 'author_id' })
   author: UserEntity;
   @OneToMany(() => BlogLikesEntity, (likes) => likes.blog)
   likes: BlogLikesEntity[];
   @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
   bookmarks: BlogBookmarkEntity[];
   @CreateDateColumn()
   create_at: Date;
   @UpdateDateColumn()
   update_at: Date;
}
