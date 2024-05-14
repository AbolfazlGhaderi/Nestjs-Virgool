import { EntityEnum } from "src/common/enums";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.model";
import { UserEntity } from "./user.entity";

@Entity({ name: EntityEnum.BlogBookmark })
export class BlogBookmarkEntity{
    @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'blog_id' })
    blog: BlogEntity
    @ManyToOne(() => UserEntity, (user) => user.bookmarks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user:UserEntity
}