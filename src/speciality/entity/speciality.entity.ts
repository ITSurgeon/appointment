import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';

@Entity()
@Index(['name'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class Speciality extends CommonEntity {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToMany(() => User, (user: User) => user.specialities)
  public users: User[];
}
