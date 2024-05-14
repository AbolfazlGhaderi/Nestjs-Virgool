import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityEnum } from 'src/common/enums';

@Entity(EntityEnum.Category)
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column({ nullable: false, unique: true })
  title: string;
  @Column({ nullable: false, unique: false, type: 'text' })
  description: string;
  @Column({ nullable: true, default: null })
  parentId: string;
}
