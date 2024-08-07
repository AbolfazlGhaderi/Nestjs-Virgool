import { ModelEnum } from '../../common/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BlogEntity } from './blog.model';
import { UserEntity } from './user.model';

@Entity({ name: ModelEnum.Comment })
export class CommentEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ nullable: false })
    text: string;
    @Column({ default: false })
    accepted: boolean;
    @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'blog_id' })
    blog: BlogEntity;
    @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;
    @ManyToOne(() => CommentEntity, (comment) => comment.children, { onDelete: 'CASCADE' })
    parent: CommentEntity;
    @OneToMany(() => CommentEntity, (comment) => comment.parent, { nullable:true })
    @JoinColumn({ name: 'parent_id' })
    children: CommentEntity[];
    @CreateDateColumn()
    create_at: Date;
}
