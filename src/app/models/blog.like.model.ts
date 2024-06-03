import { modelEnum } from 'src/common/enums';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from './blog.model';
import { UserEntity } from './user.model';

@Entity({ name: modelEnum.BlogLike })
export class BlogLikesEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity;
   @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
}
