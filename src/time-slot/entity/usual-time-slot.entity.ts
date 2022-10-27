import { Column, Entity, ManyToMany } from 'typeorm';
import { CommonEntity } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class UsualTimeSlotEntity extends CommonEntity {
  @Column({ nullable: true })
  dayOfWeek: number;

  @Column({ type: 'time', nullable: true })
  timeStart: Date;

  @Column({ type: 'time', nullable: true })
  timeEnd: Date;

  @ManyToMany(() => User, (user: User) => user.usualTimeSlots, {
    eager: true,
    cascade: true,
  })
  public specialists: User[];
}
