import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CommonEntity } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';
import { SpecificTimeslot } from './specific-time-slot.entity';

@Entity()
export class UsualTimeslot extends CommonEntity {
  @Column({ nullable: true })
  dayOfWeek: number;

  @Column({ type: 'time', nullable: true })
  timeStart: Date;

  @Column({ type: 'time', nullable: true })
  timeEnd: Date;

  @ManyToMany(() => User, (user: User) => user.usualTimeSlots)
  @JoinTable()
  public specialists: User[];

  @ManyToMany(
    () => SpecificTimeslot,
    (specificTimeSlot: SpecificTimeslot) => specificTimeSlot.usualTimeSlots,
  )
  public specificTimeSlots: SpecificTimeslot[];
}
