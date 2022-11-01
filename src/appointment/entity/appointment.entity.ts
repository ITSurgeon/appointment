import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';
import { Service } from '../../service/entity/service.entity';
import { SpecificTimeslot } from '../../time-slot/entity/specific-time-slot.entity';

@Entity()
export class Appointment extends CommonEntity {
  @Column({ nullable: true })
  public comment: string;

  @Column({ nullable: true })
  public minCost: string;

  @ManyToMany(() => User, (user: User) => user.specialistAppointments)
  public specialists: User[];

  @ManyToMany(() => User, (user: User) => user.clientAppointments)
  public clients: User[];

  @ManyToMany(() => Service, (service: Service) => service.appointments)
  @JoinTable()
  public services: Service[];

  @ManyToMany(
    () => SpecificTimeslot,
    (specificTimeSlot: SpecificTimeslot) => specificTimeSlot.appointments,
  )
  @JoinTable()
  public specificTimeSlots: SpecificTimeslot[];
}
