import { EntityEnum } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from './blog.model';
import { BlogLikesEntity } from './like.model';
import { BlogBookmarkEntity } from './bookmark.model';

@Entity({ name: EntityEnum.User })
export class UserEntity {
   @PrimaryGeneratedColumn('increment')
   id: number;
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
   @OneToMany(() => BlogEntity, (blog) => blog.author)
   blog: BlogEntity[];
   @OneToMany(() => BlogLikesEntity, (like) => like.user)
   likes: BlogLikesEntity[];
   @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
   bookmarks: BlogBookmarkEntity[];

}
