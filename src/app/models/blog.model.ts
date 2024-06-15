import { UserEntity } from './user.model';
import { modelEnum } from 'src/common/enums';
import { CommentEntity } from './comment.model';
import { BlogLikesEntity } from './blog.like.model';
import { BlogCategoryEntity } from './blog.category.model';
import { BlogBookmarkEntity } from './blog.bookmark.model';
import { BlogStatus } from 'src/common/enums/blog/status.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity(modelEnum.Blog)
export class BlogEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @Column()
   title: string;
   @Column()
   description: string;
   @Column()
   content: string;
   @Column({ nullable: false, unique: true })
   slug: string;
   @Column({ nullable: false })
   time_for_study: string;
   @Column({ nullable: true })
   image: string;
   @Column({ enum: BlogStatus, default: BlogStatus.Draft })
   status: string;
   @ManyToOne(() => UserEntity, (user) => user.blog)
   @JoinColumn({ name: 'author_id' })
   user: UserEntity;
   @OneToMany(() => BlogLikesEntity, (likes) => likes.blog)
   likes: BlogLikesEntity[];
   @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
   bookmarks: BlogBookmarkEntity[];
   @OneToMany(() => CommentEntity, (comment) => comment.blog)
   comments: CommentEntity[];
   @OneToMany(() => BlogCategoryEntity, (blogCategory) => blogCategory.blog)
   blog_category: BlogCategoryEntity[];
   @CreateDateColumn()
   create_at: Date;
   @UpdateDateColumn()
   update_at: Date;
}
