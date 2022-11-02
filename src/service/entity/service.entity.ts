import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';
import { Appointment } from '../../appointment/entity/appointment.entity';

@Entity()
@Index(['name'], {
  unique: true,
  where: '"deletedAt" IS NULL',
})
export class Service extends CommonEntity {
  @Column()
  public name: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public minCost: string;

  @ManyToMany(() => User, (user: User) => user.services)
  public users: User[];

  @ManyToMany(() => User, (user: User) => user.services)
  public appointments: Appointment[];
}
