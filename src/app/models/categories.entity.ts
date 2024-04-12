import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

@Entity('categories')
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
