import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';
import { Service } from '../../service/entity/service.entity';
import { SpecificTimeSlotEntity } from '../../time-slot/entity/specific-time-slot.entity';

@Entity()
export class Appointment extends CommonEntity {
  @Column({ nullable: true })
  public comment: string;

  @Column({ nullable: true })
  public minCost: string;

  @ManyToMany(() => User, (user: User) => user.specialistAppointments, {
    eager: true,
    cascade: true,
  })
  public specialists: User[];

  @ManyToMany(() => User, (user: User) => user.clientAppointments, {
    eager: true,
    cascade: true,
  })
  public clients: User[];

  @ManyToMany(() => Service, (service: Service) => service.appointments, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public services: Service[];

  @ManyToMany(
    () => SpecificTimeSlotEntity,
    (specificTimeSlot: SpecificTimeSlotEntity) => specificTimeSlot.appointments,
    {
      eager: true,
      cascade: true,
    },
  )
  public specificTimeSlots: SpecificTimeSlotEntity[];
}
