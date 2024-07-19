import { ModelEnum } from '../../common/enums';
import { BlogCategoryEntity } from './blog.category.model';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity(ModelEnum.Category)
export class CategoryEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ nullable: false, unique: true })
    title: string;
    @Column({ nullable: true, unique: false, type: 'text' })
    description: string;
    @ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: 'CASCADE' })
    parent: CategoryEntity;
    @OneToMany(() => CategoryEntity, (category) => category.parent)
    @JoinColumn({ name: 'parent_id' })
    children: CategoryEntity[];
    @OneToMany(() => BlogCategoryEntity, (blogCategory) => blogCategory.category)
    blog_category: BlogCategoryEntity[];
    @CreateDateColumn()
    create_at:Date;
    @UpdateDateColumn()
    update_at:Date;
}
