import { modelEnum } from 'src/common/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity(modelEnum.Category)
export class CategoryEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;
   @Column({ nullable: false, unique: true })
   title: string;
   @Column({ nullable: false, unique: false, type: 'text' })
   description: string;
   @Column({ nullable: true, default: null })
   parentId: string;
}
