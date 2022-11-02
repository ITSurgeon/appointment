import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CommonEntity } from '../../common/common.entity';
import { User } from '../../user/entities/user.entity';
import { Appointment } from '../../appointment/entity/appointment.entity';
import { UsualTimeslot } from './usual-time-slot.entity';

@Entity()
export class SpecificTimeslot extends CommonEntity {
  @Column({ type: 'timestamp without time zone', nullable: true })
  dateTimeStart: Date;

  @Column({ type: 'timestamp without time zone', nullable: true })
  dateTimeEnd: Date;

  @Column({ default: true })
  working: boolean;

  @Column({ default: true })
  available: boolean;

  @ManyToMany(
    () => Appointment,
    (appointment: Appointment) => appointment.specificTimeSlots,
  )
  public appointments: Appointment[];

  @ManyToMany(() => User, (user: User) => user.specificTimeSlots, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public specialists: User[];

  @ManyToMany(
    () => UsualTimeslot,
    (usualTimeSlot: UsualTimeslot) => usualTimeSlot.specificTimeSlots,
    {
      eager: true,
      cascade: true,
    },
  )
  @JoinTable()
  public usualTimeSlots: UsualTimeslot[];
}
