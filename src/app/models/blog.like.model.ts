import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ModelEnum } from '../../common/enums'
import { BlogEntity } from './blog.model'
import { UserEntity } from './user.model'

@Entity({ name: ModelEnum.BlogLike })
export class BlogLikesEntity
{
   @PrimaryGeneratedColumn('uuid')
   id: string
   @ManyToOne(() => BlogEntity, (blog) => blog.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'blog_id' })
   blog: BlogEntity
   @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity
}
