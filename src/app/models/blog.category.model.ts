import { BlogEntity } from './blog.model';
import { ModelEnum } from '../../common/enums';
import { CategoryEntity } from './category.model';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: ModelEnum.BlogCategory })
export class BlogCategoryEntity
{
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ManyToOne(() => BlogEntity, (blog) => blog.blog_category, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity;

   @ManyToOne(() => CategoryEntity, (category) => category.blog_category, { nullable: true, onDelete: 'CASCADE' })
   @JoinColumn({ name: 'category_id' })
   category: CategoryEntity;
}
