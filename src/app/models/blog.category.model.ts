import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ModelEnum } from '../../common/enums'
import { BlogEntity } from './blog.model'
import { CategoryEntity } from './category.model'

@Entity({ name: ModelEnum.BlogCategory })
export class BlogCategoryEntity
{
   @PrimaryGeneratedColumn('uuid')
   id: string

   @ManyToOne(() => BlogEntity, (blog) => blog.blog_categories, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity

   @ManyToOne(() => CategoryEntity, (category) => category.blog_category, { nullable: true, onDelete: 'CASCADE' })
   @JoinColumn({ name: 'category_id' })
   category: CategoryEntity
}
