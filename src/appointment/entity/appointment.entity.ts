import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../common/common.entity';
import { Service } from '../../service/entity/service.entity';

@Entity()
export class Appointment extends CommonEntity {
  @Column({ nullable: true })
  public comment: string;

  @Column({ nullable: true })
  public minCost: string;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'time', nullable: true })
  timeStart: Date;

  @ManyToMany(() => User, (user: User) => user.specialistAppointments, {
    eager: true,
    cascade: true,
  })
  public specialist: User[];

  @ManyToMany(() => User, (user: User) => user.clientAppointments, {
    eager: true,
    cascade: true,
  })
  public client: User[];

  @ManyToMany(() => Service, (service: Service) => service.appointments, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  public service: Service[];
}
