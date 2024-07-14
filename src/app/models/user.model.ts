import { ModelEnum } from '../../common/enums/model.enum';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.model';
import { BlogEntity } from './blog.model';
import { BlogLikesEntity } from './blog.like.model';
import { BlogBookmarkEntity } from './blog.bookmark.model';
import { CommentEntity } from './comment.model';
import { ImageEntity } from './image.model';

@Entity({ name: ModelEnum.User })
export class UserEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ nullable: false, unique: true })
    username: string;
    @Column({ nullable: true, unique: true })
    phone: string;
    @Column({ nullable: true, unique: true })
    email: string;
    @Column({ nullable: false, default: false })
    verify_email: boolean;
    @Column({ nullable: false, default: false })
    verify_phone: boolean;
    @Column({ nullable: true, unique: false })
    password: string;
    @CreateDateColumn()
    create_at: Date;
    @UpdateDateColumn()
    update_at: Date;
    @DeleteDateColumn({ nullable: true, default: null })
    delete_at: Date;

    @OneToOne(() => ProfileEntity, (profile) => profile.user)
    profile: ProfileEntity;
    @OneToMany(() => BlogEntity, (blog) => blog.user)
    blog: BlogEntity[];
    @OneToMany(() => BlogLikesEntity, (like) => like.user)
    likes: BlogLikesEntity[];
    @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
    bookmarks: BlogBookmarkEntity[];
    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comments: CommentEntity[];
    @OneToMany(() => ImageEntity, (image) => image.user)
    image: ImageEntity[];
}
