import { EntityEnum } from 'src/common/enums';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.model';
import { UserEntity } from './user.entity';

@Entity({ name: EntityEnum.BlogLike })
export class BlogLikesEntity {
   @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity; 
   @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
}
