import { EntityEnum } from 'src/common/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: EntityEnum.Profile })
export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  profile_id:number
  @Column({ nullable: false })
  nick_name: string;
  @Column({ nullable: true,default:null })
  image_profile: string;
  @Column({ nullable: true,default:null })
  bg_image: string;
  @Column({ nullable: true,default:null })
  bio: string;
  @Column({ nullable: true,default:null })
  gender: string;
  @Column({ nullable: true,default:null })
  birth_day: Date;
  @Column({ nullable: true,default:null })
  linkedin_profile: string;
}
