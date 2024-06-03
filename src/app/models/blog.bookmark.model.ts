import { modelEnum } from 'src/common/enums';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from './blog.model';
import { UserEntity } from './user.model';

@Entity({ name: modelEnum.BlogBookmark })
export class BlogBookmarkEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity;
   @ManyToOne(() => UserEntity, (user) => user.bookmarks, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
}
