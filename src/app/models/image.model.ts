import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ModelEnum } from '../../common/enums'
import { UserEntity } from './user.model'

@Entity(ModelEnum.Image)
export class ImageEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ nullable: false, unique: true })
    name: string
    @Column({ nullable: false })
    location: string
    @Column({ nullable: false })
    alt: string
    @ManyToOne(() => UserEntity, (user) => user.image, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity
    @CreateDateColumn()
    create_at: Date
}
