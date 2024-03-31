import { Column, Entity } from 'typeorm';

@Entity({ name: 'profile' })
export class ProfileEntity {
  @Column({ nullable: false })
  nick_name: string;
  @Column({ nullable: true })
  image_profile: string;
  @Column({ nullable: true })
  bg_image: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birth_day: Date;
  @Column({ nullable: true })
  linkedin_profile: string;
}
