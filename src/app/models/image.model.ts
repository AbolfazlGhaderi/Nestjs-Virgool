import { UserEntity } from './user.model';
import { ImageFolderNameEnum, modelEnum } from 'src/common/enums';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity(modelEnum.Image)
export class ImageEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @Column({ nullable: false, unique: true })
   name: string;
   @Column({ nullable: false })
   location: string;
   @Column({ nullable: false })
   alt: string;
   @Column({ nullable: true, unique: true })
   hash?: string;
   @Column({ nullable: false, enum: ImageFolderNameEnum, default: ImageFolderNameEnum.Images })
   FolderName: string;
   @ManyToOne(() => UserEntity, (user) => user.image, { nullable: false })
   @JoinColumn({ name: 'user_id' })
   user: UserEntity;
   @CreateDateColumn()
   create_at: Date;
}
